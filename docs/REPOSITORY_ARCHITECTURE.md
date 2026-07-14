# Repository Architecture & Standards

The Repository pattern mediates between the domain and data mapping layers using a collection-like interface for accessing domain objects. To ensure enterprise scalability and maintainability, our repositories strictly adhere to the following architectural standards.

## CQRS Separation (Read vs. Write)
- **Write Repositories (Commands)**: Responsible purely for state mutations (`save`, `delete`). They load full Aggregate Roots from the primary transactional database (e.g., PostgreSQL primary node) to enforce invariants, apply changes, and save them back.
- **Read Repositories (Queries)**: Responsible for fetching data for the UI or reports. They bypass the heavy Aggregate Root hydration and query directly into optimized Data Transfer Objects (DTOs). They route to Read Replicas, Caches, or Search Indices (e.g., Elasticsearch).

## Transactions
- **Unit of Work**: Repositories must not manage database transactions internally. Transactions are managed at the Use Case (Application Service) level using a Unit of Work pattern or transactional decorators.
- **Single Aggregate Rule**: A single transaction should only mutate one Aggregate Root.
- **Outbox Pattern**: If a transaction mutates an Aggregate and emits a Domain Event, both the mutation and the event must be saved in the same transaction using the Transactional Outbox pattern to guarantee eventual consistency.

## Caching Strategy
- **Read-Through**: Repositories implement read-through caching for highly requested, rarely changing aggregates (e.g., `Menu`, `TenantProfile`).
- **Invalidation**: Cache invalidation is triggered by Domain Events (e.g., `MenuUpdated` event clears the menu cache for that specific tenant).
- **Stale-While-Revalidate**: For non-critical read queries, the repository returns stale cached data while asynchronously rehydrating the cache in the background.

## Querying Standards
- **Pagination**: 
  - Standardized on **Cursor-based pagination** (keyset pagination) for high-performance, deep scrolling.
  - Offset-based pagination is strictly limited to small, bounded lists due to `OFFSET` performance degradation.
- **Filtering**:
  - Filter criteria are passed to the Read Repository via a generic `Specification` or `Criteria` object, preventing the repository from bloating with hundreds of `findByXAndY` methods.
- **Sorting**:
  - Sort fields must be explicitly whitelisted to prevent database index misses or slow queries. Multi-column sorting is supported but restricted to pre-indexed combinations.
- **Searching**:
  - Full-text search (e.g., searching for a customer by name) is not executed via SQL `LIKE` clauses. Read repositories route search queries to a dedicated Search Engine (e.g., Elasticsearch) synced via Domain Events.
