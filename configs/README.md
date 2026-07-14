# Centralized Configurations (`/configs`)

This directory holds the shared configuration files used by the applications and packages. Centralizing configurations ensures that all projects within the monorepo adhere to the same strict code quality and formatting standards.

## Structure
- `/eslint`: Shared ESLint configurations (base, React, Next.js, NestJS).
- `/typescript`: Base `tsconfig.json` files extending across the monorepo.
- `/tailwind`: Shared TailwindCSS presets and design tokens.

## Rules
- **Inheritance**: Apps and packages should extend these base configurations rather than defining their own rules from scratch.
- **Zero Drift**: Keep linting and formatting strictly consistent across the entire codebase to reduce cognitive load on developers.
