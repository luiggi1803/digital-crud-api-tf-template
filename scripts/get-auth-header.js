const CognitoAuthHeader = require('./CognitoAuthHeader');

const usage = () => {
  console.error('Uso:');
  console.error('  node scripts/get-auth-header.js <email> <password> [nueva_password]');
  console.error('  COGNITO_USER_EMAIL=... COGNITO_USER_PASSWORD=... node scripts/get-auth-header.js');
  console.error('');
  console.error('Si Cognito pide NEW_PASSWORD_REQUIRED (usuario creado por admin),');
  console.error('pasa la contraseña permanente como 3er argumento o reutiliza la misma.');
  process.exit(1);
};

async function main() {
  const email = process.env.COGNITO_USER_EMAIL || process.argv[2];
  const password = process.env.COGNITO_USER_PASSWORD || process.argv[3];
  const newPassword = process.env.COGNITO_NEW_PASSWORD || process.argv[4];

  if (!email || !password) {
    usage();
  }

  const auth = new CognitoAuthHeader();
  const authorization = await auth.getAuthorizationHeader(email, password, newPassword);

  console.log(authorization);
}

main().catch((error) => {
  console.error('Error obteniendo Authorization:', error.message);
  process.exit(1);
});
