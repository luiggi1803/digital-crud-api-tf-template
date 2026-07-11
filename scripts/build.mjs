import { cpSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const buildDir = join(root, 'build');

rmSync(buildDir, { recursive: true, force: true });
mkdirSync(buildDir, { recursive: true });

cpSync(join(root, 'dist'), join(buildDir, 'dist'), { recursive: true });

const pkg = {
  name: 'digital-crud-api-tf-lambda',
  version: '1.0.0',
  main: 'dist/items/infrastructure/bootstrap/App.js',
  dependencies: {
    '@aws-sdk/client-dynamodb': '3.478.0',
    '@aws-sdk/client-ssm': '3.478.0',
    '@aws-sdk/lib-dynamodb': '3.478.0',
    '@middy/core': '4.5.5',
    '@nestjs/common': '10.4.19',
    '@nestjs/core': '10.4.19',
    joi: '17.13.3',
    'reflect-metadata': '0.1.14',
    uuid: '9.0.1'
  }
};

writeFileSync(join(buildDir, 'package.json'), JSON.stringify(pkg, null, 2));
execSync('npm install --omit=dev', { cwd: buildDir, stdio: 'inherit' });

console.log('✅ Build Lambda listo en build/');
