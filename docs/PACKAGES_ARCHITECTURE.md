# Packages Architecture

The platform utilizes a monorepo structure (e.g., using Turborepo or Nx) to modularize the codebase into discrete, reusable packages. This enforces strict dependency boundaries, improves build caching, and allows sharing logic across web, mobile, and backend services.

## Core & Domain
- **`core/`**: Fundamental business logic, pure domain models, and shared constants.
- **`config/`**: Global configuration schemas, environment variable parsing, and shared settings.
- **`types/`**: Shared TypeScript interfaces, type definitions, and Enums used across the entire monorepo.
- **`contracts/`**: API schemas, request/response DTOs, and RPC definitions (e.g., tRPC or OpenAPI).
- **`events/`**: Event-driven architecture payloads, topic names, and messaging contracts.

## Infrastructure & Services
- **`database/`**: ORM schemas (Prisma/Drizzle), migrations, and abstract repository interfaces.
- **`storage/`**: Cloud storage abstractions (S3, R2) for asset uploads and retrieval.
- **`api-client/`**: Strongly-typed HTTP clients or SDKs generated from the contracts.
- **`auth-sdk/`**: Authentication helpers, JWT verification, and session management.
- **`payments/`**: Payment gateway integrations, webhooks processing, and billing logic.
- **`notifications/`**: Email, SMS, and Push notification templates and dispatchers.

## Frontend & UI
- **`ui/`**: The shared component library (React/React Native), headless components, and complex composite widgets.
- **`design-tokens/`**: Platform-agnostic design tokens (colors, spacing, typography) often exported as JSON/CSS variables.
- **`theme/`**: Theme engine logic, dark mode management, and dynamic CSS variable injection.
- **`hooks/`**: Shared React hooks for state management, data fetching, and lifecycle handling.
- **`validation/`**: Form validation schemas (Zod/Yup) shared between the frontend forms and backend API routes.
- **`i18n/`**: Internationalization dictionaries, locale formats, and translation functions.

## Observability & Utilities
- **`logger/`**: Structured logging utilities (e.g., Pino) configured for different environments.
- **`analytics/`**: Telemetry dispatchers, tracking events, and user behavior metrics.
- **`monitoring/`**: Performance metrics, error tracking (Sentry), and health check probes.
- **`feature-flags/`**: Progressive delivery toggles, A/B testing evaluation, and rollout strategies.
- **`security/`**: Cryptography helpers, input sanitization, and security middlewares.
- **`utils/`**: Pure functional utilities, date/time formatting, and common helpers.
