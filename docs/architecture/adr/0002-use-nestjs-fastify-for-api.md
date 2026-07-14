# 2. Use NestJS with Fastify for the Core API

Date: 2026-07-13
Status: Accepted

## Context
The platform requires a robust backend capable of handling high-volume concurrent traffic (e.g., sudden order spikes during dinner rush), complex business domains (inventory, payments, CRM), and real-time WebSocket communication for POS terminals.

## Decision
We will use **NestJS** utilizing the **Fastify** adapter instead of Express.

## Rationale
- **Architecture**: NestJS enforces a strict, Angular-like modular architecture (Dependency Injection, Controllers, Providers). This is essential for maintaining order in a massive codebase with multiple engineering teams.
- **Performance**: The Fastify adapter provides up to 2x better throughput than Express. In a high-volume transactional environment like restaurant ordering, this performance margin translates directly to reduced server costs and higher reliability.
- **Ecosystem**: NestJS provides out-of-the-box support for WebSockets, Microservices, and CQRS patterns.

## Consequences
- Steeper learning curve for developers used to minimal frameworks like Express.
- Highly testable, modular, and performant backend codebase.
