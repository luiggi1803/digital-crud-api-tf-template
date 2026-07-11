import { APIGatewayProxyResult } from 'aws-lambda';
import { ItemDynamoRepository } from '../../src/items/infrastructure/repository/ItemDynamoRepository';

export const buildRequest = (
  action: string,
  payload: object = {},
  query: object = {},
  path: object = {},
  headers: object = {},
  httpMethod = 'GET'
) => ({
  ...require('./request/middleware-lambda.json'),
  action,
  body: payload,
  queryStringParameters: query,
  pathParameters: path,
  path: '',
  headers,
  httpMethod
});

export const parseHandlerError = (response: APIGatewayProxyResult) => {
  const body = JSON.parse(response.body);
  return body.error;
};

export const mockItemDynamoRepository = (mockData: unknown, metodo: string) => {
  jest
    .spyOn(ItemDynamoRepository.prototype, metodo as keyof ItemDynamoRepository)
    .mockImplementationOnce(() => Promise.resolve(mockData) as never);
};

export const dbExceptionMockRepository = (metodo: string) => {
  jest.spyOn(ItemDynamoRepository.prototype, metodo as keyof ItemDynamoRepository).mockImplementation(() => {
    throw new Error('Database Exception');
  });
};
