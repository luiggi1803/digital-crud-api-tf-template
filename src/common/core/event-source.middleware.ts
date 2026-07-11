import { MiddlewareObj } from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult, EventBridgeEvent, S3Event, SNSEvent, SQSEvent } from 'aws-lambda';
import { Logger } from '../Logger';
import { HTTP_CONSTANT } from './http.constant';
import { EventApiGateWayWithAuthorizer, RequestDto } from '../application/dto/RequestDto';
import CustomException from '../application/exception/CustomException';
import { ERROR_ERROR_INTERNO } from '../application/exception/ErrorConstants';
import { ItemController } from '../../items/infrastructure/controller/ItemController';
import { CrudAction } from './resolve-crud-action';

enum EVENT_SOURCE {
  API_GATEWAY = 'API Gateway',
  S3 = 'S3',
  SNS = 'SNS',
  SQS = 'SQS',
  EVENT_BRIDGE = 'EventBridge',
  STEP_FUNCTIONS = 'Step Functions',
  LAMBDA = 'Lambda'
}

type EventSourceMiddlewareOptions = {
  region?: string;
  source?: EVENT_SOURCE;
  passthrough?: boolean;
};

const logger: Logger = new Logger('EventSourceMiddleware');

const buildApiGatewayErrorResponse = (error: CustomException): APIGatewayProxyResult => ({
  statusCode: error.httpStatus,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    error: {
      code: error.code,
      message: error.message,
      ...(error.details?.length ? { details: error.details } : {})
    }
  })
});

const buildInternalErrorResponse = (): APIGatewayProxyResult => ({
  statusCode: HTTP_CONSTANT.INTERNAL_SERVER_ERROR_STATUS.code,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    error: {
      code: ERROR_ERROR_INTERNO.CODIGO,
      message: ERROR_ERROR_INTERNO.MENSAJE
    }
  })
});

const eventSourceMiddleware = (options: EventSourceMiddlewareOptions = {}): MiddlewareObj => {
  const identifyEventSource = (event: any): EVENT_SOURCE => {
    if (event.httpMethod) {
      return EVENT_SOURCE.API_GATEWAY;
    }
    if (Array.isArray(event.Records) && (event.Records[0] as { eventSource?: string })?.eventSource === 'aws:s3') {
      return EVENT_SOURCE.S3;
    }
    if (Array.isArray(event.Records) && (event.Records[0] as { EventSource?: string })?.EventSource === 'aws:sns') {
      return EVENT_SOURCE.SNS;
    }
    if (Array.isArray(event.Records) && (event.Records[0] as { eventSource?: string })?.eventSource === 'aws:sqs') {
      return EVENT_SOURCE.SQS;
    }
    if (event['detail-type']) {
      return EVENT_SOURCE.EVENT_BRIDGE;
    }
    if (event.action) {
      return EVENT_SOURCE.LAMBDA;
    }
    return EVENT_SOURCE.STEP_FUNCTIONS;
  };

  const parseApiGatewayBody = (body: string | null) => {
    if (!body) {
      return {};
    }

    if (typeof body !== 'string') {
      return body;
    }

    try {
      return JSON.parse(body);
    } catch (error) {
      logger.error('Error parseando body: ' + error);
      return {};
    }
  };

  const extractInfoAuthorizer = (event: EventApiGateWayWithAuthorizer) => {
    const principalId = event.identity?.authorizer?.principalId ?? '';
    const tipoDocumento = principalId.charAt(0);
    const nroDocumento = principalId.slice(1);

    return {
      identidad: {
        numId: event.identity?.authorizer?.numId,
        nroDocumento,
        tipoDocumento,
        codigoExterno: event.identity?.authorizer?.codigoExterno,
        tercerosDuplicados: []
      }
    };
  };

  const extractApiGatewayPayload = (event: APIGatewayProxyEvent) => {
    const parsedBody = parseApiGatewayBody(event.body);
    const bodyPayload = (parsedBody as { payload?: unknown }).payload || parsedBody;
    const bodyUser = extractInfoAuthorizer(event as EventApiGateWayWithAuthorizer);

    return {
      query: event.queryStringParameters || {},
      payload: bodyPayload,
      path: event.pathParameters || {},
      body: event.body,
      headers: event.headers,
      httpMethod: event.httpMethod,
      user: bodyUser
    };
  };

  const extractPayload = (event: any) => {
    const source = identifyEventSource(event);
    logger.log(`Handler Event Source:: ${source}`);
    switch (source) {
      case EVENT_SOURCE.API_GATEWAY:
        return extractApiGatewayPayload(event as APIGatewayProxyEvent);
      case EVENT_SOURCE.S3:
        return (event as S3Event).Records.map((record) => ({
          bucket: record.s3.bucket.name,
          key: record.s3.object.key,
          eventName: record.eventName
        }));
      case EVENT_SOURCE.SNS:
        return (event as SNSEvent).Records.map((record) => ({
          message: record.Sns.Message,
          messageAttributes: record.Sns.MessageAttributes
        }));
      case EVENT_SOURCE.SQS:
        return (event as SQSEvent).Records.map((record) => ({
          messageId: record.messageId,
          body: record.body,
          attributes: record.attributes
        }));
      case EVENT_SOURCE.EVENT_BRIDGE:
        return (event as EventBridgeEvent<string, unknown>).detail;
      case EVENT_SOURCE.STEP_FUNCTIONS:
      case EVENT_SOURCE.LAMBDA:
        return { action: event.action, payload: event.payload };
      default:
        return event;
    }
  };

  return {
    before: async (handler: any) => {
      const event = handler.event;
      const source = options.source || identifyEventSource(event);
      const payload = extractPayload(event);

      handler.event.source = source;
      handler.event.payload = payload;
    },
    after: async (handler: any) => {
      if (handler.event.source === EVENT_SOURCE.API_GATEWAY) {
        const { action, payload } = handler.event;

        const exception = new CustomException({
          code: ERROR_ERROR_INTERNO.CODIGO,
          message: ERROR_ERROR_INTERNO.MENSAJE,
          httpStatus: HTTP_CONSTANT.INTERNAL_SERVER_ERROR_STATUS.code
        });

        exception.throw(!action);

        const controller = handler.response as ItemController;
        const functionToExecute = controller[action as CrudAction];
        exception.throw(!functionToExecute);

        const data = await controller[action as CrudAction](payload as RequestDto);

        if (data && typeof data === 'object' && 'payload' in data) {
          handler.response = {
            statusCode: 200,
            body: JSON.stringify(data)
          };
        } else {
          handler.response = {
            statusCode: 200,
            body: JSON.stringify({ payload: data })
          };
        }
      }
    },
    onError: async (handler: any) => {
      if (handler.event?.source !== EVENT_SOURCE.API_GATEWAY) {
        return;
      }

      const err = handler.error;
      handler.response =
        err instanceof CustomException ? buildApiGatewayErrorResponse(err) : buildInternalErrorResponse();
    }
  };
};

export default eventSourceMiddleware;
export { EVENT_SOURCE };
