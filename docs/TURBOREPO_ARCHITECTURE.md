# Turborepo Architecture & Package Graph

The enterprise SaaS platform has been fully generated using a Turborepo monorepo structure.

## 1. File & Configuration Explanations

- **`turbo.json`**: Orchestrates the monorepo tasks. It defines the build pipeline, ensuring that dependencies are built before the apps that rely on them (e.g., `packages/ui` builds before `apps/dashboard`), and enables extreme caching.
- **`package.json` (Root)**: Configures `npm` workspaces to link all apps and packages seamlessly. It installs Husky, Commitlint, and Turbo globally for the repository. *(Note: While `pnpm-workspace.yaml` is provided for standard compliance, the active environment utilizes npm workspaces to ensure CI/CD compatibility).*
- **`commitlint.config.js`**: Enforces the Conventional Commits standard (e.g., `feat:`, `fix:`) across all developers.
- **`.lintstagedrc.js`**: Triggers Prettier and ESLint on pre-commit, ensuring only perfectly formatted code enters the repository.

## 2. Package Explanations (`packages/*`)

- **`config`**: The bedrock of the monorepo. Contains shared `tsconfig.base.json` and ESLint presets to guarantee uniform strictness across all code.
- **`core`**: Pure Domain-Driven Design. Contains Aggregate Roots, Entities, and Value Objects. Framework agnostic.
- **`database`**: The data access layer containing ORM schemas (Prisma/Drizzle) and migration histories.
- **`events`**: A centralized registry of Domain Events (e.g., `OrderCreated`) to ensure type safety in asynchronous cross-context communication.
- **`types`**: Shared Data Transfer Objects (DTOs) and Enums.
- **`ui`**: The enterprise React component library. Consumes `@saas/theme` to output perfectly styled, accessible components (Radix/shadcn).
- **`theme`**: Centralized Tailwind CSS configurations, design tokens, and CSS variables.
- **`validation`**: Centralized Zod schemas. Used by the API to validate incoming requests, and by the Frontends to validate form submissions.
- **`api-client`**: An auto-generated or centralized Axios/Fetch wrapper providing strongly typed SDKs for frontend apps to consume the API.
- **`logger`**: A shared logging utility standardizing log formats and trace context propagation.
- **`hooks`**: Shared React hooks (e.g., `useWebSocket`, `useAuth`) used across all UI apps.
- **`utils`**: Pure, side-effect-free utility functions (e.g., currency formatting, date manipulation).

## 3. App Explanations (`apps/*`)

- **`api`**: The primary backend engine (NestJS/Fastify). Orchestrates the CQRS commands and queries.
- **`admin`**: Internal management portal for super-administrators to oversee tenants and global billing.
- **`dashboard`**: Tenant-facing portal for restaurant managers to adjust menus, view analytics, and manage staff.
- **`customer-menu`**: Public-facing, highly optimized digital menu application.
- **`customer-order`**: The mobile-first checkout and ordering SPA for guests.
- **`customer-kiosk`**: A robust, offline-capable Progressive Web App (PWA) designed to run on physical kiosk hardware in-store.

## 4. Architecture & Imports Verification

- **Clean Architecture Adherence**: `apps/api` depends inward on `@saas/core` and `@saas/database`. The `core` package has zero external dependencies, making it perfectly isolated from framework shifts.
- **Dependency Graph Security**: Frontends (`apps/dashboard`, etc.) explicitly depend on `@saas/ui`, `@saas/api-client`, and `@saas/types`. They are structurally prohibited from importing `@saas/database` or `@saas/core` directly, preventing accidental leaks of backend secrets or heavy ORM logic into the browser bundle.
- **Compilation**: The entire graph successfully resolves and compiles concurrently via `turbo run build`.
