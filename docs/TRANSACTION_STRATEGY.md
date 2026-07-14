# Transaction Strategy & Standards

In a distributed, high-scale enterprise architecture, strict ACID transactions across boundaries cause severe bottlenecks and coupling. Our strategy balances strong consistency where critical and eventual consistency where scalable, fortified by resilient failure handling.

## Consistency Models

- **Strong Consistency**: Applied strictly *within* a single Aggregate Root. A single database transaction must ensure that all invariants of the Aggregate are satisfied before committing.
- **Eventual Consistency**: Applied *across* Aggregate Roots and Bounded Contexts. State changes are communicated asynchronously via Domain Events. For example, when an `Order` is placed (Strong), the `Inventory` is depleted milliseconds or seconds later (Eventual).

## Distributed Transactions

- **No 2-Phase Commit (2PC)**: Distributed transactions using 2PC are strictly forbidden due to database locking, latency, and poor fault tolerance across microservices.
- **Saga Pattern**: Cross-service workflows (e.g., Order Placement -> Payment -> Kitchen Routing) are orchestrated using the Saga pattern. Each step executes a local database transaction and publishes an event to trigger the next step.
- **Choreography vs. Orchestration**: We prefer Choreography for simple, linear workflows. We use Orchestration (a dedicated Saga Coordinator) for complex workflows requiring conditional logic, state tracking, and complex rollbacks.

## Rollback & Compensation

- **Compensating Transactions**: In a Saga, if a downstream step fails, upstream steps cannot be "rolled back" via traditional DB mechanics. We must execute *Compensating Transactions* (e.g., `RefundPayment`, `ReleaseInventory`) to conceptually undo the previous steps.
- **Forward Recovery**: In certain scenarios (e.g., a failure to send an email receipt), we do not roll back the transaction. Instead, we rely on Forward Recovery by retrying the failed step until it succeeds.

## Retries & Idempotency

- **Idempotency**: Every command, event handler, and mutating API endpoint MUST be idempotent. Applying the same operation multiple times must yield the same system state as applying it once. This is enforced via `Idempotency-Key` headers and database deduplication tables.
- **Exponential Backoff**: Transient failures (e.g., network timeouts, gateway errors) are retried automatically using exponential backoff with jitter to prevent thundering herd scenarios.
- **Dead Letter Queues (DLQ)**: If an event handler fails after maximum retries (a "poison pill"), the event is safely routed to a DLQ for manual intervention or automated analysis, ensuring the primary event stream is never blocked.
