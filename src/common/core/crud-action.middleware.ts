import { MiddlewareObj } from '@middy/core';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { resolveCrudAction } from './resolve-crud-action';

const crudActionMiddleware = (): MiddlewareObj => {
  return {
    before: async (handler) => {
      const event = handler.event as APIGatewayProxyEvent & { action?: string };
      if (event.httpMethod && !event.action) {
        event.action = resolveCrudAction(event.httpMethod, event.path ?? '', event.pathParameters);
      }
    }
  };
};

export default crudActionMiddleware;
