# Shared Packages (`/packages`)

This directory contains internal libraries and modules that are shared across multiple applications. This is the backbone of our DRY (Don't Repeat Yourself) strategy within the monorepo.

## Structure
- `/ui`: Shared React component library (TailwindCSS + shadcn/ui) used across frontends.
- `/database`: Centralized Prisma schema, migrations, and generated client. Single source of truth.
- `/auth`: Authentication and authorization logic (JWT validation, tenant isolation, RBAC).
- `/config`: Shared ESLint, Prettier, TypeScript, and Tailwind configurations.
- `/types`: Global TypeScript interfaces and Zod schemas shared strictly across all boundaries.
- `/utils`: Common business logic, formatting helpers, and standard utility functions.
- `/payments`: Abstracted payment gateway integrations (Stripe, Square) for SaaS billing/orders.
- `/storage`: Cloud storage abstractions (S3/R2) for menu images, assets, and exports.
- `/notifications`: Multi-channel delivery module (WebSockets, Email, SMS, Push).
- `/analytics`: Telemetry, event tracking, and centralized logging interfaces.
- `/ai`: Shared LLM orchestrations, prompt templates, and AI utility functions.

## Rules
- **Framework Agnostic Where Possible**: Business logic in packages should avoid framework lock-in (e.g., pure TypeScript for utils).
- **Strict Versioning/Dependencies**: Packages must declare their dependencies correctly. Use workspace configurations to link packages.
