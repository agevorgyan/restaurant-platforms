# Database Strategy & Architecture

To support a multi-tenant SaaS platform capable of scaling to 100,000+ restaurants, the database strategy must balance strict data integrity with high-performance querying and historical auditing.

## 1. Normalization & Schema Design
- **3rd Normal Form (3NF) by Default**: The primary OLTP database (PostgreSQL) is strictly normalized to 3NF to prevent update anomalies and ensure data integrity.
- **Strategic Denormalization**: We selectively denormalize data into JSONB columns *only* for immutable snapshotting (e.g., storing the exact product name and price inside an `OrderLine` at the time of purchase) to prevent historical orders from mutating if the catalog changes.
- **Tenant Isolation**: Every table representing tenant data must have a `tenant_id` column. Row-Level Security (RLS) is enforced at the database level to guarantee cross-tenant isolation.

## 2. Indexing Strategy
- **Primary & Foreign Keys**: All PKs and FKs are explicitly indexed. We use `UUIDv7` for primary keys to ensure lexicographical sorting, reducing index fragmentation and page splits.
- **Composite Indexes**: Tailored for frequent access patterns (e.g., `CREATE INDEX ON orders (tenant_id, created_at)`).
- **Partial Indexes**: Used to optimize sparse queries (e.g., `CREATE INDEX ON orders (tenant_id) WHERE status = 'PENDING'`).

## 3. Data Lifecycle & Mutation
- **Soft Deletes**: Hard deletes (`DELETE`) are strictly forbidden for domain entities to preserve relational integrity and audit trails. We use an `is_deleted` boolean flag (or `deleted_at` timestamp). Partial indexes exclude deleted rows for performance.
- **Optimistic Concurrency Control (Versioning)**: High-contention entities (e.g., `Inventory`, `Order`) include a `version` integer column. Updates increment the version and fail if the version has changed since the read, preventing lost updates without heavy row locks.

## 4. Auditing & History
- **Audit Triggers**: Database-level triggers automatically record all `INSERT`, `UPDATE`, and `DELETE` operations into an append-only `audit_logs` table.
- **Event Sourcing (Selective)**: For hyper-critical aggregates (e.g., Financial Ledgers, Inventory Movements), we do not update state in place. We append immutable domain events and project the current state, providing a perfect historical ledger.

## 5. Search Engine Architecture
- **Offloading Text Search**: PostgreSQL `LIKE` or `tsvector` queries are insufficient for complex, multi-lingual fuzzy searching across 100M+ catalog items.
- **Elasticsearch/Typesense Integration**: Read Repositories route search queries (e.g., "Find all vegan burgers") to a dedicated Search Engine. The search index is kept eventually consistent via Domain Events consumed by a background worker.

## 6. Caching Architecture
- **Multi-Tiered Caching**:
  - *L1 (In-Memory)*: Application-level cache (e.g., LRU cache) for static configurations.
  - *L2 (Distributed)*: Redis clusters for session state, rate limiting, and materialized read models (e.g., fully hydrated public menus).
- **Cache Stampede Prevention**: We utilize probabilistic early expiration (XFetch) or mutex locks when regenerating expensive cache keys.
