import authMiddleware from '../../src/common/core/auth.middleware';
import { EVENT_SOURCE } from '../../src/common/core/event-source.middleware';
import { ERROR_NO_AUTORIZADO } from '../../src/common/application/exception/ErrorConstants';

describe('authMiddleware', () => {
  const originalAuthRequired = process.env.AUTH_REQUIRED;

  afterEach(() => {
    process.env.AUTH_REQUIRED = originalAuthRequired;
  });

  it('should skip auth when AUTH_REQUIRED is false', async () => {
    process.env.AUTH_REQUIRED = 'false';
    const middleware = authMiddleware();
    const handler: any = {
      event: {
        source: EVENT_SOURCE.API_GATEWAY,
        payload: { user: null }
      }
    };

    await expect(middleware.before?.(handler)).resolves.toBeUndefined();
  });

  it('should reject API Gateway requests without authenticated user', async () => {
    process.env.AUTH_REQUIRED = 'true';
    const middleware = authMiddleware();
    const handler: any = {
      event: {
        source: EVENT_SOURCE.API_GATEWAY,
        httpMethod: 'GET',
        payload: { user: null }
      }
    };

    await expect(middleware.before?.(handler)).rejects.toMatchObject({
      code: ERROR_NO_AUTORIZADO.CODIGO,
      httpStatus: 401
    });
  });

  it('should allow API Gateway requests with cognito sub', async () => {
    process.env.AUTH_REQUIRED = 'true';
    const middleware = authMiddleware();
    const handler: any = {
      event: {
        source: EVENT_SOURCE.API_GATEWAY,
        httpMethod: 'POST',
        payload: { user: { sub: 'cognito-sub-123' } }
      }
    };

    await expect(middleware.before?.(handler)).resolves.toBeUndefined();
  });

  it('should skip OPTIONS preflight requests', async () => {
    process.env.AUTH_REQUIRED = 'true';
    const middleware = authMiddleware();
    const handler: any = {
      event: {
        source: EVENT_SOURCE.API_GATEWAY,
        httpMethod: 'OPTIONS',
        payload: { user: null }
      }
    };

    await expect(middleware.before?.(handler)).resolves.toBeUndefined();
  });

  it('should skip non API Gateway events', async () => {
    process.env.AUTH_REQUIRED = 'true';
    const middleware = authMiddleware();
    const handler: any = {
      event: {
        source: EVENT_SOURCE.S3,
        payload: { user: null }
      }
    };

    await expect(middleware.before?.(handler)).resolves.toBeUndefined();
  });
});
