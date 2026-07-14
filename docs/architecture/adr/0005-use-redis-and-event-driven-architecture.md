# 5. Use Redis and Event-Driven Architecture

Date: 2026-07-13
Status: Accepted

## Context
When a customer places an order, multiple disconnected systems must react: the POS must ring, the kitchen display must update, inventory must be deducted, and an email receipt must be sent. Doing this synchronously would block the main thread and cause timeouts.

## Decision
We will adopt an **Event-Driven Architecture** utilizing **Redis** as our message broker and caching layer.

## Rationale
- **Decoupling**: Emitting events (e.g., `OrderPlacedEvent`) allows different domains to react independently.
- **Redis & BullMQ**: Redis provides the sub-millisecond in-memory data store required to back BullMQ. BullMQ will handle background job queues (e.g., sending emails, syncing third-party delivery orders) with robust retry logic.
- **WebSockets**: Redis Pub/Sub will synchronize WebSocket state across multiple horizontally scaled NestJS API instances.

## Consequences
- Adds infrastructural complexity (Redis management).
- Guarantees high availability and non-blocking API endpoints under heavy load.
