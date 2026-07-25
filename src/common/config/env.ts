const REQUIRED_ENV_VARS = ['DYNAMODB_TABLE_ITEMS'] as const;

export type RequiredEnvVar = (typeof REQUIRED_ENV_VARS)[number];

export function getRequiredEnv(name: RequiredEnvVar): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Variable de entorno requerida no definida: ${name}`);
  }
  return value;
}

export function getRegion(): string {
  return process.env.REGION?.trim() || 'us-east-1';
}

export function validateEnv(): void {
  for (const name of REQUIRED_ENV_VARS) {
    getRequiredEnv(name);
  }
}

export function isAuthRequired(): boolean {
  const value = process.env.AUTH_REQUIRED?.trim().toLowerCase();
  return value === 'true' || value === '1';
}
