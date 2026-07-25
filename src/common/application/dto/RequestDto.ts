export interface RequestDto {
  payload: object;
  query: object;
  path: object;
  user: AuthorizedUser | null;
  trace?: object;
  headers: object;
  httpMethod?: string;
}

export interface AuthorizedUser {
  sub: string;
  email?: string;
  username?: string;
}

export interface EventApiGateWayWithAuthorizer {
  identity?: {
    authorizer?: {
      principalId?: string;
      numId?: string;
      codigoExterno?: string;
    };
  };
}
