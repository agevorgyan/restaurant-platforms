# 1. Use Turborepo for Monorepo Management

Date: 2026-07-13
Status: Accepted

## Context
We are building a large-scale Restaurant SaaS platform consisting of multiple independent Next.js applications (Admin, Dashboard, Menu, POS) and a core backend (NestJS). These applications share significant business logic, UI components, and database schemas. We need a way to manage this complexity without duplicating code.

## Decision
We will use **Turborepo** as our monorepo build system.

## Rationale
- **Speed**: Turborepo provides intelligent remote caching and task pipelining, ensuring that we only rebuild packages that have changed. This keeps CI/CD times low.
- **Simplicity**: Compared to Nx, Turborepo is a lightweight drop-in that leverages existing `package.json` scripts without requiring proprietary configuration files or generators.
- **Next.js Synergy**: Built by Vercel, Turborepo has first-class, optimized support for Next.js applications.

## Consequences
- Developers must adhere to strict boundary rules and declare dependencies properly in `package.json`.
- We gain lightning-fast builds and zero code duplication across the frontend and backend.
