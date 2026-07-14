#!/bin/bash
set -e

npm install -g pnpm@9.5.0

cat << 'EOF' > package.json
{
  "name": "restaurant-saas",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "prepare": "husky"
  },
  "devDependencies": {
    "turbo": "latest",
    "husky": "latest",
    "prettier": "latest",
    "@commitlint/cli": "latest",
    "@commitlint/config-conventional": "latest",
    "typescript": "latest",
    "eslint": "9.x",
    "@eslint/js": "latest",
    "@typescript-eslint/eslint-plugin": "latest",
    "@typescript-eslint/parser": "latest"
  },
  "packageManager": "pnpm@9.5.0"
}
EOF

cat << 'EOF' > pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
EOF

cat << 'EOF' > turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
EOF

cat << 'EOF' > commitlint.config.js
module.exports = { extends: ['@commitlint/config-conventional'] };
EOF

cat << 'EOF' > eslint.config.mjs
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  {
    ignores: ["**/dist/**", "**/.next/**", "**/node_modules/**"]
  }
];
EOF

mkdir -p packages/config
cat << 'EOF' > packages/config/package.json
{
  "name": "@saas/config",
  "version": "0.0.0",
  "private": true,
  "main": "index.js"
}
EOF

cat << 'EOF' > packages/config/tsconfig.base.json
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
EOF

mkdir -p packages/types/src
cat << 'EOF' > packages/types/package.json
{
  "name": "@saas/types",
  "version": "0.0.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@saas/config": "workspace:*",
    "typescript": "latest"
  }
}
EOF

cat << 'EOF' > packages/types/tsconfig.json
{
  "extends": "@saas/config/tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "declaration": true
  },
  "include": ["src"]
}
EOF

echo "export type User = { id: string; name: string; };" > packages/types/src/index.ts

mkdir -p packages/logger/src
cat << 'EOF' > packages/logger/package.json
{
  "name": "@saas/logger",
  "version": "0.0.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@saas/config": "workspace:*",
    "typescript": "latest"
  }
}
EOF

cat << 'EOF' > packages/logger/tsconfig.json
{
  "extends": "@saas/config/tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "declaration": true
  },
  "include": ["src"]
}
EOF

echo "export const log = (msg: string) => console.log(msg);" > packages/logger/src/index.ts

mkdir -p apps/api/src
cat << 'EOF' > apps/api/package.json
{
  "name": "@saas/api",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "build": "tsc",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@saas/types": "workspace:*",
    "@saas/logger": "workspace:*"
  },
  "devDependencies": {
    "@saas/config": "workspace:*",
    "typescript": "latest"
  }
}
EOF

cat << 'EOF' > apps/api/tsconfig.json
{
  "extends": "@saas/config/tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"]
}
EOF

cat << 'EOF' > apps/api/src/index.ts
import { log } from '@saas/logger';
import type { User } from '@saas/types';
const user: User = { id: '1', name: 'Test' };
log(\`API started for user \${user.name}\`);
EOF

pnpm install
pnpm run build
pnpm run typecheck
pnpm run lint

npx husky init
echo "pnpm run lint" > .husky/pre-commit
echo "pnpm exec commitlint --edit \$1" > .husky/commit-msg

