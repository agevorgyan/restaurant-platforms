# Platform Core Architecture Review

A critical review of the current Platform Core architecture to identify and mitigate weaknesses, tight coupling, scalability bottlenecks, and duplicated responsibilities, elevating the system to true enterprise quality.

## Identified Weaknesses & Mitigations

### 1. Tight Coupling in Shared Types
- **Risk**: A monolithic `@platform/types` package creates a tight coupling bottleneck. Every domain depends on it; a change in the `Menu` type forces the `Billing` domain to update.
- **Mitigation**: Move from a monolithic types package to **Domain-Specific Contracts**. Generate types from OpenAPI/AsyncAPI specifications per Bounded Context. Only cross-domain integration events should share a common schema registry.

### 2. Scalability Bottlenecks
- **Risk (Database Contention)**: The `Orders` and `Inventory` tables will experience high write contention during peak meal hours.
- **Mitigation**: Implement **CQRS (Command Query Responsibility Segregation)** for high-throughput domains. Route heavy analytical queries (e.g., daily sales reports) to Read Replicas or a dedicated OLAP datastore.
- **Risk (WebSocket Connections)**: Managing thousands of concurrent WebSocket connections for real-time kitchen displays (KDS) and driver tracking on single instances.
- **Mitigation**: Introduce a **Redis Pub/Sub Backplane** to distribute WebSocket messages across a stateless fleet of connection handlers.

### 3. Edge Routing Latency
- **Risk**: Tenant Resolution querying the central database for custom domain lookups on every incoming HTTP request.
- **Mitigation**: Push tenant domain mapping to the Edge using **Cloudflare Workers & KV Storage**. The Edge instantly resolves the tenant and forwards the request with the `X-Tenant-ID` header injected.

### 4. Duplicated Responsibilities
- **Risk (RBAC vs. Feature Flags)**: Developers misusing Feature Flags to manage user permissions, or using RBAC to hide unfinished features.
- **Mitigation**: Strict enforcement of intent. **RBAC** answers "Is this user authorized to perform action X?". **Feature Flags** answer "Is this feature code path active for this tenant?". They evaluate sequentially: Flag first, then RBAC.
- **Risk (Audit Logs vs. Domain Events)**: Emitting dual events for auditing and business logic.
- **Mitigation**: The Domain Event (e.g., `OrderPlaced`) must act as the single source of truth, forwarded to an Event Store which subsequently sinks into the Audit Log.
