import 'reflect-metadata';
import middy from '@middy/core';
import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import {
  crudActionMiddleware,
  eventSourceMiddleware,
  requestMiddleware,
  ssmMiddleware
} from '../../../common/core';
import { validateEnv } from '../../../common/config/env';
import { CustomLoggerSupport } from '../../../common/application/supports';
import { ItemController } from '../controller/ItemController';
import { AppModule } from './AppModule';
import handleRequest from './HandlerCore';

let appContext: INestApplicationContext;

const bootstrap = async (
  event: APIGatewayProxyEvent & { source?: string; payload?: object; action?: string }
): Promise<ItemController | APIGatewayProxyResult> => {
  validateEnv();

  if (!appContext) {
    appContext = await NestFactory.createApplicationContext(AppModule, {
      logger: false
    });
    appContext.useLogger(new CustomLoggerSupport('items'));
  }

  const { action } = event;
  const controller = handleRequest(appContext, action as string);
  return controller ?? ({} as ItemController);
};

const createHandler = () => {
  const baseHandler = middy(bootstrap)
    .use(requestMiddleware())
    .use(crudActionMiddleware())
    .use(ssmMiddleware())
    .use(eventSourceMiddleware());

  return (event: APIGatewayProxyEvent, context?: Partial<Context>) => {
    if (context?.awsRequestId) {
      process.env.AWS_REQUEST_ID = context.awsRequestId;
    }

    return baseHandler(event, context as Context);
  };
};

export const handler = createHandler();
