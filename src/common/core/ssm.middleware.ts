import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { MiddlewareObj } from '@middy/core';
import { Logger } from '../Logger';

interface SSMOptions {
  region?: string;
}

process.env.SSM_IS_LOADED = 'NO';

const ssmMiddleware = (options: SSMOptions = {}): MiddlewareObj => {
  const ssmClient = new SSMClient({ region: options.region });

  const getSSMParameter = async (name: string): Promise<string> => {
    const command = new GetParameterCommand({
      Name: name,
      WithDecryption: true
    });
    const response = await ssmClient.send(command);
    return response.Parameter?.Value ?? '';
  };

  return {
    before: async (handler) => {
      const { context } = handler;
      const logger: Logger = new Logger('ssmMiddleware', context);
      const envVars = process.env;

      if (envVars.SSM_IS_LOADED === 'SI') {
        return;
      }

      const ssmPromises = Object.entries(envVars).map(async ([key, value]) => {
        if (typeof value === 'string' && value.startsWith('ssm:')) {
          const ssmName = value.slice(4);
          const ssmValue = await getSSMParameter(ssmName);
          process.env[key] = ssmValue;
        }
      });

      const results = await Promise.allSettled(ssmPromises);
      process.env.SSM_IS_LOADED = results.some((r) => r.status !== 'fulfilled') ? 'NO' : 'SI';
    }
  };
};

export default ssmMiddleware;
