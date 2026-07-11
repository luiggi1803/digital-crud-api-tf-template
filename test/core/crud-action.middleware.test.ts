import { crudActionMiddleware } from '../../src/common/core';

describe('crudActionMiddleware', () => {
  it('should map GET /items to listarItems', async () => {
    const middleware = crudActionMiddleware();
    const handler: any = {
      event: {
        httpMethod: 'GET',
        path: '/dev/items',
        pathParameters: null
      }
    };

    if (middleware.before) {
      await middleware.before(handler);
    }

    expect(handler.event.action).toBe('listarItems');
  });

  it('should map GET /items/{id} to obtenerItem', async () => {
    const middleware = crudActionMiddleware();
    const handler: any = {
      event: {
        httpMethod: 'GET',
        path: '/dev/items/abc-123',
        pathParameters: { id: 'abc-123' }
      }
    };

    if (middleware.before) {
      await middleware.before(handler);
    }

    expect(handler.event.action).toBe('obtenerItem');
  });

  it('should map POST /items to crearItem', async () => {
    const middleware = crudActionMiddleware();
    const handler: any = {
      event: {
        httpMethod: 'POST',
        path: '/dev/items',
        pathParameters: null
      }
    };

    if (middleware.before) {
      await middleware.before(handler);
    }

    expect(handler.event.action).toBe('crearItem');
  });
});
