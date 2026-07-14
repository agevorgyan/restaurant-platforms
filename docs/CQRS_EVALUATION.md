# CQRS Application Evaluation

Command Query Responsibility Segregation (CQRS) separates the data models used to update information (Commands) from the models used to read information (Queries). While powerful, it introduces significant architectural complexity and eventual consistency overhead. It should **not** be applied universally.

## Where CQRS is MANDATORY (High Value)

### 1. Catalog & Menus Context
- **Why**: The read-to-write ratio is extreme. A menu is updated perhaps once a week (low write throughput), but its QR code might be scanned thousands of times an hour by guests (massive read throughput). 
- **Application**: The Write model enforces complex invariants (e.g., modifier group constraints). Domain events trigger the creation of a flattened, highly optimized Read model pushed directly to an Edge CDN or Redis, bypassing the database entirely for queries.

### 2. Ordering & POS Context
- **Why**: Extreme write contention during peak meal hours. Processing an order requires transactional integrity, locking, and validation. Simultaneously, dashboards, KDS screens, and receipt printers are constantly querying order states.
- **Application**: Separating the models prevents long-running analytical or polling queries from locking the tables required for high-speed transaction inserts. The Read model can be tailored for fast list-views (e.g., active tickets by station).

### 3. Intelligence Context (Analytics & Reports)
- **Why**: Generating a "Daily Sales by Category" report involves joining millions of historical order lines, payments, and catalog items. Running this on the primary transactional database (OLTP) will cause catastrophic slowdowns.
- **Application**: Domain events (e.g., `OrderCompleted`) are projected asynchronously into a dedicated OLAP database (e.g., ClickHouse) optimized for columnar aggregation. The Query side connects exclusively to this OLAP store.

## Where CQRS is OVERKILL (Use Standard CRUD)

### 1. Identity & Access (IAM)
- **Why**: User management and RBAC are straightforward. Queries are typically simple key lookups (`findById`, `findByEmail`), and mutations are infrequent. Standard Repository CRUD is perfectly adequate; CQRS would only add useless boilerplate.

### 2. Tenant & Billing (Basic Settings)
- **Why**: Managing restaurant operating hours, table layouts, and subscription tiers involves simple, relational data structures with low throughput. A standard ORM/Repository approach is easier to maintain and reason about.

### 3. Platform Foundation (Notifications)
- **Why**: This is essentially an append-only log (inserting a notification record) and simple status updates. There is no complex read-model requirement that justifies separating the read/write paths.
