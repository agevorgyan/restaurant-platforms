#!/bin/bash
set -e

node -e "
const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.devDependencies.typescript = '^5.4.5';
pkg.devDependencies.eslint = '^9.0.0';
pkg.devDependencies['@eslint/js'] = '^9.0.0';
pkg.devDependencies['@typescript-eslint/eslint-plugin'] = '^8.0.0';
pkg.devDependencies['@typescript-eslint/parser'] = '^8.0.0';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

let tsconfig = JSON.parse(fs.readFileSync('packages/config/tsconfig.base.json', 'utf8'));
tsconfig.compilerOptions.moduleResolution = 'bundler';
fs.writeFileSync('packages/config/tsconfig.base.json', JSON.stringify(tsconfig, null, 2));
"

pnpm install
pnpm run build
pnpm run typecheck
pnpm run lint
