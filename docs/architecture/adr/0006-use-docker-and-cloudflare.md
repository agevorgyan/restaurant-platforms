# 6. Use Docker and Cloudflare

Date: 2026-07-13
Status: Accepted

## Context
We need a deployment strategy that is reproducible, scalable, and secure globally.

## Decision
We will containerize all applications using **Docker** and proxy all public traffic through **Cloudflare**.

## Rationale
- **Docker**: Provides immutable infrastructure. A container tested in CI is guaranteed to run exactly the same way in production. It allows us to easily orchestrate local development (spinning up Postgres/Redis instantly) and scale production via Kubernetes or Docker Swarm.
- **Cloudflare**: Acts as our global CDN and Web Application Firewall (WAF). By caching static assets (menu images, Next.js bundles) at the edge, we drastically reduce latency for mobile users inside restaurants and protect our API from DDoS attacks.

## Consequences
- Requires strict adherence to stateless application design.
- Highly secure, globally performant, and reliable infrastructure.
