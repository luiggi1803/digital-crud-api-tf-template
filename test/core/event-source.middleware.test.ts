import { APIGatewayProxyEvent, EventBridgeEvent, S3Event, SNSEvent, SQSEvent } from 'aws-lambda';
import { EVENT_SOURCE, eventSourceMiddleware } from '../../src/common/core';
import CustomException from '../../src/common/application/exception/CustomException';

describe('eventSourceMiddleware', () => {
  it('should identify API Gateway event', async () => {
    const event: APIGatewayProxyEvent = {
      httpMethod: 'GET',
      body: null,
      headers: {},
      multiValueHeaders: {},
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      pathParameters: null,
      stageVariables: null,
      requestContext: {} as APIGatewayProxyEvent['requestContext'],
      resource: '',
      path: '',
      isBase64Encoded: false
    };

    const middleware = eventSourceMiddleware();
    const handler: any = { event };
    if (middleware.before) {
      await middleware.before(handler);
    }

    expect(handler.event.source).toBe(EVENT_SOURCE.API_GATEWAY);
  });

  it('should map cognito claims to request user', async () => {
    const event: APIGatewayProxyEvent = {
      httpMethod: 'GET',
      body: null,
      headers: {},
      multiValueHeaders: {},
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      pathParameters: null,
      stageVariables: null,
      requestContext: {
        authorizer: {
          claims: {
            sub: 'abc-123',
            email: 'user@example.com',
            'cognito:username': 'user@example.com'
          }
        }
      } as any,
      resource: '',
      path: '',
      isBase64Encoded: false
    };

    const middleware = eventSourceMiddleware();
    const handler: any = { event };
    if (middleware.before) {
      await middleware.before(handler);
    }

    expect(handler.event.payload.user).toEqual({
      sub: 'abc-123',
      email: 'user@example.com',
      username: 'user@example.com'
    });
  });

  it('should identify S3 event', async () => {
    const event: S3Event = {
      Records: [
        {
          eventSource: 'aws:s3',
          s3: {
            bucket: { name: 'bucket-name' },
            object: { key: 'object-key' }
          }
        } as any
      ]
    };

    const middleware = eventSourceMiddleware();
    const handler: any = { event };
    if (middleware.before) {
      await middleware.before(handler);
    }

    expect(handler.event.source).toBe(EVENT_SOURCE.S3);
  });

  it('should identify SNS event', async () => {
    const event: SNSEvent = {
      Records: [
        {
          EventSource: 'aws:sns',
          Sns: {
            Message: 'message',
            MessageAttributes: {}
          }
        } as any
      ]
    };

    const middleware = eventSourceMiddleware();
    const handler: any = { event };
    if (middleware.before) {
      await middleware.before(handler);
    }

    expect(handler.event.source).toBe(EVENT_SOURCE.SNS);
  });

  it('should identify SQS event', async () => {
    const event: SQSEvent = {
      Records: [
        {
          eventSource: 'aws:sqs',
          messageId: 'message-id',
          body: 'body',
          attributes: {}
        } as any
      ]
    };

    const middleware = eventSourceMiddleware();
    const handler: any = { event };
    if (middleware.before) {
      await middleware.before(handler);
    }

    expect(handler.event.source).toBe(EVENT_SOURCE.SQS);
  });

  it('should identify EventBridge event', async () => {
    const event: EventBridgeEvent<any, any> = {
      'detail-type': 'detail-type',
      detail: {}
    } as any;

    const middleware = eventSourceMiddleware();
    const handler: any = { event };
    if (middleware.before) {
      await middleware.before(handler);
    }

    expect(handler.event.source).toBe(EVENT_SOURCE.EVENT_BRIDGE);
  });

  it('should map CustomException to API Gateway error response', async () => {
    const middleware = eventSourceMiddleware();
    const error = new CustomException({
      code: 'CRUD002',
      message: 'Item no encontrado',
      httpStatus: 404
    });

    const handler: { event: { source: string }; error: unknown; response?: unknown } = {
      event: { source: EVENT_SOURCE.API_GATEWAY },
      error
    };

    if (middleware.onError) {
      await middleware.onError(handler as never);
    }

    expect(handler.response).toEqual({
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: {
          code: 'CRUD002',
          message: 'Item no encontrado'
        }
      })
    });
  });
});
