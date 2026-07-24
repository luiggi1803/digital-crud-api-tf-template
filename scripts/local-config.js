const DEV_LOCAL = {
  REGION: 'us-east-2',
  STAGE: 'dev',
  DYNAMODB_TABLE_ITEMS: 'UE2-digital-crud-api-dev-items',
  LOG_LEVEL: 'INFO,ERROR,DEBUG',
  NO_COLOR: 'true',
  IS_OFFLINE: 'true',
  AUTH_REQUIRED: 'false',
  AWS_ENDPOINT_URL: 'http://localhost:4566' //Floci -eliminar
};

module.exports = { DEV_LOCAL };
