#!/bin/bash
set -e

npm install -g pnpm@9.5.0

# Update root package.json typescript version
node -e "
const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.devDependencies.typescript = '^5.0.0';
pkg.devDependencies.eslint = '^8.0.0';
pkg.devDependencies['@typescript-eslint/eslint-plugin'] = '^7.0.0';
pkg.devDependencies['@typescript-eslint/parser'] = '^7.0.0';
pkg.devDependencies['@eslint/js'] = '^8.0.0';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

# Fix TS config
cat << 'EOF2' > packages/config/tsconfig.base.json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true
  }
}
EOF2

cat << 'EOF2' > packages/types/tsconfig.json
{
  "extends": "@saas/config/tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "declaration": true,
    "rootDir": "src"
  },
  "include": ["src"]
}
EOF2

cat << 'EOF2' > packages/logger/tsconfig.json
{
  "extends": "@saas/config/tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "declaration": true,
    "rootDir": "src"
  },
  "include": ["src"]
}
EOF2

cat << 'EOF2' > apps/api/tsconfig.json
{
  "extends": "@saas/config/tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
EOF2

pnpm install
pnpm run build
pnpm run typecheck
pnpm run lint
