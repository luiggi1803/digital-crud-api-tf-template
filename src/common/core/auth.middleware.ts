import { MiddlewareObj } from '@middy/core';
import { APIGatewayProxyEvent } from 'aws-lambda';
import CustomException from '../application/exception/CustomException';
import { ERROR_NO_AUTORIZADO } from '../application/exception/ErrorConstants';
import { isAuthRequired } from '../config/env';
import { HTTP_CONSTANT } from './http.constant';
import { EVENT_SOURCE } from './event-source.middleware';

const authMiddleware = (): MiddlewareObj => {
  return {
    before: async (handler) => {
      if (!isAuthRequired()) {
        return;
      }

      const event = handler.event as APIGatewayProxyEvent & {
        source?: string;
        payload?: { user?: { sub?: string } | null };
        httpMethod?: string;
      };

      if (event.source !== EVENT_SOURCE.API_GATEWAY) {
        return;
      }

      if (event.httpMethod === 'OPTIONS') {
        return;
      }

      const userSub = event.payload?.user?.sub;
      if (!userSub) {
        throw new CustomException({
          code: ERROR_NO_AUTORIZADO.CODIGO,
          message: ERROR_NO_AUTORIZADO.MENSAJE,
          httpStatus: HTTP_CONSTANT.UNAUTHORIZED_STATUS.code
        });
      }
    }
  };
};

export default authMiddleware;
