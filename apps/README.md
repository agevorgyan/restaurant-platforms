# Applications (`/apps`)

This directory contains all the deployable applications for the Restaurant SaaS Platform. By keeping applications strictly isolated, we enforce clean boundaries and ensure that business logic does not leak between different deployment targets.

## Structure
- `/api`: The core NestJS + Fastify backend servicing REST, GraphQL, and WebSockets.
- `/dashboard`: Next.js application for tenant admins (CRM, Inventory, Reporting).
- `/menu`: Consumer-facing QR Menu and Online Ordering PWA.
- `/admin`: Super-admin portal for platform operators (tenant management, global billing).
- `/docs`: Developer and public API documentation, architectural decision records (ADRs).

## Rules
- **No Cross-App Imports**: Apps must never import code directly from another app. If code needs to be shared, extract it into a package within `/packages`.
- **Independent Deployability**: Every application here must be capable of being built, tested, and deployed independently of the others.
