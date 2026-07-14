# Domain Architecture Review & Enterprise Improvements

After a comprehensive review of the current domain architecture, several potential future scalability bottlenecks, tight coupling risks, and anti-patterns were identified. Below are the findings and the structural improvements mandated to achieve enterprise-grade resilience for a 100,000+ restaurant platform.

## 1. The "God Aggregate" Anti-Pattern
**Risk**: If the `Restaurant` aggregate physically holds collections of all its `Branches`, `Employees`, and `Products`, loading the Restaurant will consume massive memory and cause concurrency lock contention.
**Enterprise Fix (Strict ID-Only References)**: 
- Aggregates must NEVER hold object references to other Aggregate Roots. They must only hold the `ID` (e.g., `RestaurantId`, `BranchId`).
- A `Product` belongs to a `Restaurant` by holding a `restaurant_id`, rather than the `Restaurant` aggregate keeping a list of 10,000 Products in memory.

## 2. The Dual-Write Problem (Event Loss)
**Risk**: Saving to the primary database and publishing a Domain Event to a message broker (e.g., Kafka/RabbitMQ) in two sequential steps. If the DB commits but the broker publish fails, the system is left in an inconsistent state forever.
**Enterprise Fix (Transactional Outbox & CDC)**:
- **Transactional Outbox**: We strictly enforce writing the domain event to an `outbox_events` table in the *same* database transaction as the entity mutation.
- **Change Data Capture (CDC)**: A separate CDC process (e.g., Debezium) tails the database write-ahead log (WAL) and reliably pushes the outbox events to the message broker, guaranteeing at-least-once delivery.

## 3. Synchronous Inter-Context Coupling
**Risk**: The `Ordering` context needing customer details and making a synchronous HTTP/gRPC call to the `Identity` context. If `Identity` is down, `Ordering` fails, cascading downtime.
**Enterprise Fix (Data Duplication via Events)**:
- Bounded Contexts must be autonomous. If `Ordering` needs the customer's name for a receipt, it must listen to `CustomerUpdated` events and keep a read-only, local projection of the necessary customer data within its own database schema.

## 4. Eventual Consistency UX Degradation
**Risk**: With CQRS and Eventual Consistency, a user places an order, the page refreshes, and the order is missing because the Read Model hasn't updated yet.
**Enterprise Fix (Optimistic UI & Real-Time Push)**:
- **Optimistic Updates**: The frontend (BFF layer) applies optimistic state mutations immediately.
- **Correlation IDs & WebSockets**: The UI subscribes to a WebSocket channel with the transaction's Correlation ID. When the Read Model is finally updated, the backend pushes a confirmation event to the client to finalize the UI state.

## 5. Analytical Reporting Database Strain
**Risk**: Relying purely on Domain Events to build the OLAP / Analytics database. If a new report needs a field that wasn't included in the event payload, the data is lost.
**Enterprise Fix (Replication over Events for Data Lake)**:
- While Domain Events are used for business logic triggers, the Data Warehouse / Data Lake is populated via direct CDC replication of the primary tables (ETL/ELT processes) to ensure full historical fidelity for analytical queries without polluting Domain Events with bloated payloads.
