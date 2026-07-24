const http = require('http');
const url = require('url');
const { DEV_LOCAL } = require('./local-config');
const { resolveCrudAction } = require('../dist/common/core/resolve-crud-action');

Object.assign(process.env, DEV_LOCAL);

const PORT = 3000;

const parseBody = (req) =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', reject);
  });

const createLambdaEvent = (req, body, pathname, pathParams) => {
  const parsedUrl = url.parse(req.url, true);
  const action = resolveCrudAction(req.method, pathname, pathParams);

  return {
    httpMethod: req.method,
    path: pathname,
    pathParameters: pathParams,
    queryStringParameters: parsedUrl.query || {},
    headers: req.headers,
    body: body && Object.keys(body).length > 0 ? JSON.stringify(body) : null,
    requestContext: {
      authorizer: {
        claims: {
          sub: 'local-dev-user',
          email: 'dev@local.test',
          'cognito:username': 'dev@local.test'
        }
      },
      requestId: 'local-' + Date.now(),
      stage: 'local',
      httpMethod: req.method,
      path: pathname
    },
    isBase64Encoded: false,
    action
  };
};

const handlerPath = '../dist/items/infrastructure/bootstrap/App';
let lambdaHandler;

async function loadHandler() {
  lambdaHandler = require(handlerPath).handler;
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const pathParts = pathname.substring(1).split('/');
  const pathParams = {};

  if (pathParts.length === 2 && pathParts[0] === 'items') {
    pathParams.id = pathParts[1];
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  try {
    const body = ['POST', 'PUT', 'PATCH'].includes(req.method) ? await parseBody(req) : {};
    const event = createLambdaEvent(req, body, pathname, pathParams);
    const context = { awsRequestId: 'local-' + Date.now() };
    const result = await lambdaHandler(event, context);

    res.writeHead(result.statusCode || 200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...(result.headers || {})
    });
    res.end(result.body);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
});

server.listen(PORT, async () => {
  await loadHandler();
  console.log(`Servidor local en http://localhost:${PORT}`);
  console.log(`Región: ${process.env.REGION} | Tabla: ${process.env.DYNAMODB_TABLE_ITEMS}`);
  console.log('Endpoints: GET/POST /items, GET/PUT/DELETE /items/{id}');
});
