# Bounded Contexts (Domain-Driven Design)

As a Domain-Driven Design architect, the 16 requested functional areas have been grouped into 10 highly cohesive, loosely coupled Bounded Contexts. This prevents a monolithic "big ball of mud" and allows each domain to evolve independently.

## 1. Identity & Access Context (IAM)
- **Responsibilities**: Authentication, RBAC, tenant resolution, user security.
- **Owned Entities**: User, Role, Permission, Session, ApiKey.
- **Events**: `UserRegistered`, `UserAuthenticated`, `RoleAssigned`.
- **Public API**: `POST /auth/login`, `GET /users/me`, `PUT /users/{id}/roles`.
- **Dependencies**: None.
- **Rules**: A user can belong to multiple tenants (e.g., franchise owner). Passwords never stored in plaintext.
- **Future Scalability**: Extract to a standalone stateless microservice; integrate with enterprise SSO (OIDC/SAML).

## 2. Tenant & Billing Context
- **Responsibilities**: Restaurant management, operating hours, tables, and SaaS subscription billing.
- **Owned Entities**: Tenant, Location, Table, OperatingHours, Subscription, Invoice.
- **Events**: `TenantCreated`, `LocationOpened`, `SubscriptionRenewed`.
- **Public API**: `GET /locations`, `POST /locations/{id}/tables`, `PUT /billing/subscription`.
- **Dependencies**: Identity, Payments.
- **Rules**: A location cannot accept orders without an active subscription.
- **Future Scalability**: Geo-partitioning tenant data to local regions (e.g., EU data stays in EU) for compliance and latency.

## 3. Catalog Context
- **Responsibilities**: Menu items, QR codes, pricing tiers, modifiers, and allergens.
- **Owned Entities**: Category, MenuItem, ModifierGroup, PriceTier, QRCode.
- **Events**: `MenuItemCreated`, `PriceUpdated`, `MenuPublished`.
- **Public API**: `GET /catalog/menus`, `POST /catalog/items`, `PUT /catalog/modifiers`.
- **Dependencies**: Tenant.
- **Rules**: Items can have different prices per location. Modifiers must respect min/max cardinality rules.
- **Future Scalability**: Aggressive CDN edge-caching for QR menu reads, which will experience massive read-heavy traffic.

## 4. Ordering & POS Context
- **Responsibilities**: Cart management, order creation, discounting, taxes, and POS terminal sessions.
- **Owned Entities**: Order, OrderLine, Cart, PosSession, TaxRule.
- **Events**: `OrderPlaced`, `OrderUpdated`, `OrderCanceled`.
- **Public API**: `POST /orders`, `GET /orders/{id}`, `POST /pos/sessions/start`.
- **Dependencies**: Catalog, Payments, Guest.
- **Rules**: An online order cannot be finalized without a valid payment intent. Tax rules apply based on location.
- **Future Scalability**: Event Sourcing for the Order aggregate to handle complex concurrent state transitions without locking.

## 5. Fulfillment Context (Kitchen Display)
- **Responsibilities**: Order routing to kitchen stations, prep times, ticket management (KDS).
- **Owned Entities**: Ticket, Station, PrepTask.
- **Events**: `TicketRouted`, `TicketStarted`, `TicketCompleted`.
- **Public API**: `GET /kds/tickets`, `POST /kds/tickets/{id}/bump`.
- **Dependencies**: Ordering.
- **Rules**: A ticket must be routed to the correct prep station based on item tags (e.g., Grill vs. Fryer).
- **Future Scalability**: Stateless WebSocket backplane powered by Redis Pub/Sub for real-time ticket sync across iPads.

## 6. Inventory Context
- **Responsibilities**: Stock levels, recipes (BOM), purchase orders, and supplier management.
- **Owned Entities**: Ingredient, Recipe, StockMovement, Supplier, PurchaseOrder.
- **Events**: `StockDepleted`, `PurchaseOrderReceived`, `RecipeUpdated`.
- **Public API**: `GET /inventory/stock`, `POST /inventory/movements`, `POST /inventory/pos`.
- **Dependencies**: Fulfillment (for consumption triggers), Catalog.
- **Rules**: Stock cannot fall below zero unless explicitly allowed by location policy.
- **Future Scalability**: Eventual consistency for stock depletion to avoid locking database rows during high-volume ordering hours.

## 7. Guest Experience Context (CRM, Loyalty, Reservations)
- **Responsibilities**: Guest profiles, order history, loyalty points ledgers, and table bookings.
- **Owned Entities**: Guest, Reward, PointsLedger, Reservation.
- **Events**: `GuestCreated`, `PointsEarned`, `ReservationConfirmed`.
- **Public API**: `GET /crm/guests`, `POST /loyalty/redeem`, `POST /reservations`.
- **Dependencies**: Ordering, Tenant.
- **Rules**: Reservations must validate table capacity against the Tenant context. Points expire per tenant rules.
- **Future Scalability**: Graph databases for analyzing guest relationships, cohorts, and driving recommendation engines.

## 8. Financials & Payments Context
- **Responsibilities**: Payment gateway integration, refunds, tipping, payouts, and financial ledgers.
- **Owned Entities**: PaymentIntent, Transaction, Refund, Payout.
- **Events**: `PaymentSucceeded`, `RefundIssued`, `PayoutProcessed`.
- **Public API**: `POST /payments/intent`, `POST /payments/refund`.
- **Dependencies**: Ordering.
- **Rules**: Refunds cannot exceed the original transaction amount. All mutating actions must be idempotent.
- **Future Scalability**: Idempotency keys strictly enforced at the API gateway layer to prevent double-charging on retries.

## 9. Intelligence Context (Analytics & AI)
- **Responsibilities**: Aggregating metrics, reporting, ML inference, and demand prediction.
- **Owned Entities**: AnalyticsReport, Metric, AiPrompt, DemandForecast.
- **Events**: `ReportGenerated`, `ForecastCompleted`.
- **Public API**: `GET /analytics/sales`, `POST /ai/predict-demand`.
- **Dependencies**: All (as an event consumer).
- **Rules**: Analytics are read-only views generated from domain events. AI predictions are asynchronous.
- **Future Scalability**: Dedicated OLAP clusters (e.g., ClickHouse) for analytics; Serverless GPU inference for AI.

## 10. Platform Foundation Context (Notifications & Files)
- **Responsibilities**: System-wide utilities for emails, SMS, push, webhooks, and media asset storage.
- **Owned Entities**: NotificationEvent, WebhookEndpoint, Asset.
- **Events**: `NotificationSent`, `AssetUploaded`, `WebhookFired`.
- **Public API**: `POST /notifications/send`, `POST /assets/upload`.
- **Dependencies**: None (Infrastructure level).
- **Rules**: All uploaded files must be scanned for malware before being served.
- **Future Scalability**: Decoupled message queues (BullMQ/RabbitMQ) for guaranteed delivery of notifications and webhooks.
