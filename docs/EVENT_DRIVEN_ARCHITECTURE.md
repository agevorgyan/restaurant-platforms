# Event Driven Architecture

The Event Driven Architecture (EDA) enables asynchronous, decoupled communication between microservices, background workers, and external systems. This architecture guarantees high availability and fault tolerance for critical business processes (e.g., order fulfillment, payment processing).

## Core Concepts

- **Events**: Immutable records of state changes that have occurred in the past (e.g., `OrderPlaced`, `PaymentSucceeded`).
- **Publish / Subscribe**: Producers publish events to a centralized Event Bus without knowing who will consume them. Consumers subscribe to specific topics or patterns.
- **Asynchronous Processing**: Tasks that do not need to block the immediate HTTP response (e.g., sending emails, generating PDFs) are delegated to background workers via events.

## Reliability & Fault Tolerance

- **Retries**: Transient failures (e.g., network timeout) trigger automatic retries with exponential backoff and jitter.
- **Dead Letter Queue (DLQ)**: If an event exhausts its retry policy, it is moved to a DLQ. DLQs are monitored and allow for manual inspection, debugging, and eventual replay.
- **Ordering**: Strict ordering is maintained where necessary (e.g., `OrderCreated` must precede `OrderUpdated`) using partition keys (e.g., routing by `OrderId` or `RestaurantId`).
- **Idempotency**: At-least-once delivery guarantees mean events might be delivered multiple times. Every consumer *must* be idempotent, utilizing an Idempotency Key (usually the `EventId` or a hash of the payload) to safely ignore duplicate processing.

## Naming & Versioning

- **Naming Conventions**: Events are named using the pattern `[domain].[entity].[action]` in the past tense. 
  - *Example*: `sales.order.placed`, `billing.payment.failed`.
- **Versioning**: Event schemas are versioned. Breaking changes to a payload require a new version suffix (e.g., `sales.order.placed.v2`). Consumers must be backwards compatible to handle older versions during migrations.

## Event Payload Structure
All events share a standard envelope:
```json
{
  "eventId": "evt_12345",
  "eventType": "sales.order.placed",
  "version": "v1",
  "timestamp": "2026-07-13T14:06:20Z",
  "tenantId": "rest_987",
  "correlationId": "req_abc",
  "data": { ... } // Type-safe domain payload
}
```
