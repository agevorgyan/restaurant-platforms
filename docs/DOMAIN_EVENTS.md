# Domain Events & Naming Conventions

Domain Events capture business-significant occurrences that have happened in the past. They are the primary mechanism for cross-aggregate communication and eventual consistency in a distributed system, enabling loose coupling.

## Event Naming Conventions

To maintain a consistent and predictable event schema across the enterprise, all Domain Events must adhere to the following naming conventions:

- **Past Tense Verb**: Events represent things that have *already happened*. (e.g., `OrderCreated`, not `CreateOrder`).
- **Noun + Verb Pattern**: The name must clearly identify the Aggregate or Entity followed by the action (e.g., `[Subject][Action]`).
- **Ubiquitous Language**: Event names must use the exact terminology defined in the business domain (e.g., `OrderConfirmed`, not `CartValidated`).
- **Context Boundaries**: If an event crosses Bounded Contexts (Integration Events), it must be clearly namespaced (e.g., `Billing.SubscriptionRenewed`).

## Defined Domain Events

### Tenant & Restaurant
- **`RestaurantCreated`**: Emitted when a new tenant signs up. Triggers onboarding workflows, default role generation, and billing account creation.
- **`RestaurantActivated`**: Emitted when a restaurant completes onboarding and goes live. Triggers SEO indexing and marketplace visibility.

### Catalog & Menu
- **`MenuPublished`**: Emitted when a menu's draft changes are finalized and pushed live. Triggers cache invalidation at the Edge and QR code generation if needed.
- **`ProductUpdated`**: Emitted when a product's details (price, allergens, availability) change. Triggers cart re-validation for active sessions.

### Ordering & Fulfillment
- **`OrderCreated`**: Emitted when an order is initially assembled. Triggers inventory reservation (soft allocation) and fraud checks.
- **`OrderConfirmed`**: Emitted when the restaurant officially accepts the order. Triggers ETA calculations and customer notifications.
- **`OrderPaid`**: Emitted when the payment gateway confirms funds capture. Triggers the transition of the order to the kitchen queue (KDS).
- **`OrderCancelled`**: Emitted when an order is voided. Triggers stock release, automated refunds, and manager alerts if cancelled post-prep.
- **`OrderCompleted`**: Emitted when the order is successfully handed off or delivered. Triggers loyalty point accumulation and review solicitation.

### Customer & CRM
- **`CustomerRegistered`**: Emitted when a new guest creates an account. Triggers welcome emails and initial loyalty point bonuses.
- **`CouponApplied`**: Emitted when a discount code is successfully attached to a cart. Triggers usage limit increments and analytics tracking.
