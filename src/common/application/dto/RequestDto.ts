import { APIGatewayProxyEvent } from 'aws-lambda';

export interface RequestDto {
  payload: object;
  query: object;
  path: object;
  user: AuthorizedUser | null;
  trace?: object;
  headers: object;
  httpMethod?: string;
}

interface Identity {
  numId: string;
  nroDocumento: string;
  tipoDocumento: string;
  codigoExterno: string;
  tercerosDuplicados: string[];
}

export interface AuthorizedUser {
  identidad?: Identity;
}

export interface EventApiGateWayWithAuthorizer extends APIGatewayProxyEvent {
  identity?: {
    authorizer: {
      principalId: string;
      integrationLatency: string;
      codigoExterno: string;
      numId: string;
      tercerosDuplicados: string;
    };
  };
}
