# 3. Use Next.js for all Frontend Applications

Date: 2026-07-13
Status: Accepted

## Context
We need to build multiple frontends: a highly SEO-optimized public website, a fast consumer QR menu, a rich Dashboard for restaurant managers, and an offline-capable POS.

## Decision
We will use **Next.js (App Router)** for all frontend applications.

## Rationale
- **Versatility**: Next.js supports SSR/SSG (perfect for the marketing site and QR menus) and CSR (perfect for the interactive Dashboard and POS).
- **React Server Components (RSC)**: Allows us to move data-fetching to the server and reduce the JavaScript payload sent to low-end mobile devices in restaurants.
- **Unified Stack**: Using one framework across all 4 frontend apps reduces context switching for developers and allows us to share a single UI component library seamlessly.

## Consequences
- Requires careful understanding of Server vs. Client boundaries.
- Exceptional SEO, performance, and developer experience.
