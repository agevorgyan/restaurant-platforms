# Prisma Configuration & Database Architecture

The data access layer is centralized in the `@saas/database` package to guarantee a single source of truth for the schema, generated client, and repositories.

## 1. Schema Design (`packages/database/prisma/schema.prisma`)
- **Strict Tenant Isolation**: We employ a multi-tenant architecture with a shared database and isolated schemas. The `Tenant` model is the absolute root. 
- **UUIDv7**: We use UUIDs for all primary keys to obscure sequential data and prevent enumeration attacks while enabling decentralized ID generation.
- **Cascading Deletes**: `onDelete: Cascade` is configured at the database level for entity graphs (e.g., deleting a `Restaurant` deletes its `Products`), maintaining referential integrity without heavy application logic.
- **Soft Deletes**: Business-critical models (e.g., `Product`) include an `isDeleted` flag instead of relying solely on database cascading to preserve historical order integrity.

## 2. Singleton Client (`client.ts`)
- The `PrismaClient` is instantiated as a singleton to prevent connection exhaustion, particularly in serverless environments or during hot-reloading (HMR) where the module tree is frequently re-evaluated.
- Environment-aware logging is configured (`query` logs in dev, `error` only in production).

## 3. Repository Layer (`repositories/`)
- We strictly avoid leaking the ORM (`PrismaClient`) directly into controllers or domain logic.
- **Data Access Objects (DAOs)**: Concrete repositories (`UserRepository`, `TenantRepository`) wrap the Prisma calls. This provides a clean API for the `apps/api` and allows us to stub the database easily during unit testing.
- The repositories expose methods tailored to the business domain (e.g., `findByEmail`), abstracting away the underlying Prisma `findUnique` syntax.

## 4. Seeding & Health (`seed.ts`, `health.ts`)
- **Seed**: A robust seeding script uses `upsert` to idempotently provision a baseline `Tenant`, `Restaurant`, `Admin User`, and sample `Product`. This ensures a functional environment immediately after `db:push`.
- **Health Check**: An explicit `$queryRaw` ping validates not just network connectivity, but actual query execution capability, which is used by the Docker health checks and Kubernetes readiness probes.
