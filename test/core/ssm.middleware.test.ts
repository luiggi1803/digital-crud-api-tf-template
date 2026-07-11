import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { ssmMiddleware } from '../../src/common/core';

jest.mock('@aws-sdk/client-ssm');

describe('ssmMiddleware', () => {
  let ssmClient: SSMClient;

  beforeEach(() => {
    process.env.SSM_IS_LOADED = 'NO';
    ssmClient = new SSMClient({});
    (SSMClient as jest.Mock).mockReturnValue(ssmClient);
  });

  it('should replace environment variables with SSM parameters', async () => {
    process.env.TEST_PARAM = 'ssm:test-param';
    const mockSend = jest.fn().mockResolvedValue({ Parameter: { Value: 'valor-ssm' } });
    ssmClient.send = mockSend;

    const middleware = ssmMiddleware();
    const handler: any = { event: {}, context: {} };
    if (middleware.before) {
      await middleware.before(handler);
    }

    expect(process.env.TEST_PARAM).toBe('valor-ssm');
    expect(mockSend).toHaveBeenCalledWith(expect.any(GetParameterCommand));
  });
});
