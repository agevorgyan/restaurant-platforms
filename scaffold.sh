#!/bin/bash
set -e

# Update root package.json to include workspaces and turbo
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.workspaces = ['apps/*', 'packages/*'];
pkg.scripts = pkg.scripts || {};
pkg.scripts['build:turbo'] = 'turbo run build';
pkg.scripts['dev:turbo'] = 'turbo run dev';
pkg.scripts['lint:turbo'] = 'turbo run lint';
pkg.scripts['prepare'] = 'husky install || true';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

# Create directories
mkdir -p apps/{api,admin,dashboard,customer-menu,customer-order,customer-kiosk}/src
mkdir -p packages/{ui,theme,database,types,config,core,events,logger,validation,api-client,hooks,utils}/src

# 1. pnpm-workspace.yaml
cat << 'EOF2' > pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
EOF2

# 2. turbo.json
cat << 'EOF2' > turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!-next/cache/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
EOF2

# 3. commitlint.config.js
cat << 'EOF2' > commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
EOF2

# 4. .lintstagedrc.js
cat << 'EOF2' > .lintstagedrc.js
module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
EOF2

# 5. packages/config
cat << 'EOF2' > packages/config/package.json
{
  "name": "@saas/config",
  "version": "0.0.0",
  "private": true,
  "main": "index.js"
}
EOF2

cat << 'EOF2' > packages/config/tsconfig.base.json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "isolatedModules": true
  }
}
EOF2

cat << 'EOF2' > packages/config/eslint-preset.js
module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {},
};
EOF2

# 6. Initialize packages
for pkg in ui theme database types core events logger validation api-client hooks utils; do
  cat << EOF2 > packages/$pkg/package.json
{
  "name": "@saas/$pkg",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "eslint src/",
    "build": "tsc --noEmit"
  },
  "dependencies": {},
  "devDependencies": {
    "@saas/config": "workspace:*",
    "typescript": "^5.0.0"
  }
}
EOF2

  cat << EOF2 > packages/$pkg/tsconfig.json
{
  "extends": "@saas/config/tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"]
}
EOF2

  echo "export const name = '@saas/$pkg';" > packages/$pkg/src/index.ts
done

# 7. Initialize apps
for app in api admin dashboard customer-menu customer-order customer-kiosk; do
  cat << EOF2 > apps/$app/package.json
{
  "name": "@saas/$app",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "echo 'dev $app'",
    "build": "echo 'build $app'",
    "lint": "echo 'lint $app'"
  },
  "dependencies": {
    "@saas/core": "workspace:*",
    "@saas/types": "workspace:*",
    "@saas/logger": "workspace:*"
  },
  "devDependencies": {
    "@saas/config": "workspace:*",
    "typescript": "^5.0.0"
  }
}
EOF2

  cat << EOF2 > apps/$app/tsconfig.json
{
  "extends": "@saas/config/tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"]
}
EOF2

  echo "import { name } from '@saas/core'; console.log('App: $app, Core:', name);" > apps/$app/src/index.ts
done

# Update specific package dependencies
# UI depends on theme
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('packages/ui/package.json', 'utf8'));
pkg.dependencies['@saas/theme'] = 'workspace:*';
fs.writeFileSync('packages/ui/package.json', JSON.stringify(pkg, null, 2));
"

# API depends on database, events, validation
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('apps/api/package.json', 'utf8'));
pkg.dependencies['@saas/database'] = 'workspace:*';
pkg.dependencies['@saas/events'] = 'workspace:*';
pkg.dependencies['@saas/validation'] = 'workspace:*';
fs.writeFileSync('apps/api/package.json', JSON.stringify(pkg, null, 2));
"

echo "Scaffolding complete."
