const {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand
} = require('@aws-sdk/client-cognito-identity-provider');
const { COGNITO_CONFIG } = require('./cognito-config');

class CognitoAuthHeader {
  constructor(config = COGNITO_CONFIG) {
    this.region = config.region;
    this.userPoolId = config.userPoolId;
    this.clientId = config.clientId;
    this.client = new CognitoIdentityProviderClient({ region: this.region });
  }

  /**
   * Autentica con email/contraseña y devuelve el valor listo para el header Authorization.
   * API Gateway (authorizer Cognito) espera el Id Token: "Bearer <id_token>".
   * @param {string} [newPassword] Contraseña permanente si Cognito devuelve NEW_PASSWORD_REQUIRED
   */
  async getAuthorizationHeader(email, password, newPassword) {
    const idToken = await this.getIdToken(email, password, newPassword);
    return `Bearer ${idToken}`;
  }

  async getIdToken(email, password, newPassword) {
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    });

    try {
      const response = await this.client.send(command);
      const idToken = response.AuthenticationResult?.IdToken;

      if (idToken) {
        return idToken;
      }

      if (response.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
        const permanentPassword = newPassword ?? password;
        return this.completeNewPasswordChallenge(email, response.Session, permanentPassword);
      }

      if (response.ChallengeName) {
        throw new Error(`Cognito requiere un paso extra no soportado: ${response.ChallengeName}`);
      }

      throw new Error('Cognito no devolvió IdToken.');
    } catch (error) {
      if (error.name === 'UserNotConfirmedException') {
        throw new Error(
          'El email no está verificado. En Cognito marca email_verified=true o confirma el correo.'
        );
      }
      if (error.name === 'NotAuthorizedException') {
        throw new Error('Usuario o contraseña incorrectos.');
      }
      throw error;
    }
  }

  async completeNewPasswordChallenge(email, session, newPassword) {
    const command = new RespondToAuthChallengeCommand({
      ClientId: this.clientId,
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      Session: session,
      ChallengeResponses: {
        USERNAME: email,
        NEW_PASSWORD: newPassword
      }
    });

    const response = await this.client.send(command);
    const idToken = response.AuthenticationResult?.IdToken;

    if (!idToken) {
      throw new Error('No se pudo completar el cambio de contraseña obligatorio.');
    }

    return idToken;
  }
}

module.exports = CognitoAuthHeader;
