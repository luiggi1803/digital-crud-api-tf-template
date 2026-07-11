import { MiddlewareObj } from '@middy/core';
import { Logger } from '../Logger';

const requestMiddleware = (): MiddlewareObj => {
  return {
    before: async (handler) => {
      const { context } = handler;
      if (context?.awsRequestId) {
        process.env.AWS_REQUEST_ID = context.awsRequestId;
      }
      const logger: Logger = new Logger('RequestMiddleware', context);
      logger.log('RequestMiddleware: loaded context');
    }
  };
};

export default requestMiddleware;
