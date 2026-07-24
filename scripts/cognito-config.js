/** Valores del despliegue dev (terraform output). Sobrescribibles por variables de entorno. */
const COGNITO_CONFIG = {
  region: process.env.COGNITO_REGION || 'us-east-2',
  userPoolId: process.env.COGNITO_USER_POOL_ID || 'us-east-2_CSd7bNnuY',
  clientId: process.env.COGNITO_CLIENT_ID || '107pra591j3mr239fmv8pe0j31',
  apiUrl: process.env.API_URL || 'https://562tp00r68.execute-api.us-east-2.amazonaws.com/dev'
};

module.exports = { COGNITO_CONFIG };
