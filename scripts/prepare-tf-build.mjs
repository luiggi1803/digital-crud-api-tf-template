import { cpSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const source = join(root, 'build');
const target = join(root, 'terraform', 'build');

if (!existsSync(source)) {
  console.error('No existe build/. Ejecuta antes: npm run build');
  process.exit(1);
}

rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
cpSync(source, target, { recursive: true });

console.log('✅ Artefacto en terraform/build/ (CI lo sube a HCP; no va a git)');
