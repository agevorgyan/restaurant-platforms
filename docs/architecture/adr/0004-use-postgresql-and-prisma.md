# 4. Use PostgreSQL and Prisma

Date: 2026-07-13
Status: Accepted

## Context
The system handles sensitive financial transactions, inventory counts, and multi-tenant data. Data integrity and strict relational modeling are non-negotiable.

## Decision
We will use **PostgreSQL** as the primary relational database and **Prisma** as our ORM.

## Rationale
- **PostgreSQL**: The industry standard for robust, ACID-compliant relational databases. It natively supports advanced JSONB querying, which we need for dynamic menu modifiers, and Row-Level Security (RLS) for multi-tenant data isolation.
- **Prisma**: Provides end-to-end type safety from the database schema directly into our TypeScript codebase. It auto-generates types and provides an incredibly intuitive query API, virtually eliminating type-casting errors.

## Consequences
- Complex database migrations are handled cleanly through Prisma's migration system.
- Prisma currently has some limitations with complex aggregations, which may require raw SQL fallbacks, but the DX trade-off is overwhelmingly positive.
