# Aggregate Roots & Transactional Boundaries

In Domain-Driven Design (DDD), an Aggregate Root (AR) is the entry point to a cluster of domain objects that are treated as a single unit for data changes. It guarantees the consistency of changes being made within its boundary.

## Transactional Boundaries

- **Strict Isolation**: A single database transaction must **only** modify a single Aggregate Root. Modifying multiple ARs in one transaction tightly couples domains and creates scalability bottlenecks.
- **Eventual Consistency**: Cross-aggregate updates must be handled via Domain Events. For example, when an `Order` is finalized (AR 1), an `OrderPlaced` event is emitted. The `Inventory` (AR 2) listens to this event to deplete stock asynchronously.
- **Enforcing Invariants**: The Aggregate Root is fully responsible for enforcing its internal business rules (invariants). For example, the `Order` AR ensures that its total price perfectly matches the sum of its `OrderLines`, `Taxes`, and `Discounts` before saving.

## Defined Aggregate Roots

1. **Restaurant (Location)**
   - **Boundary**: Encapsulates operating hours, physical tables, tax settings, and location-specific policies.
   - **Invariants**: Cannot be activated without a valid timezone, currency, and complete operating hours.

2. **Menu**
   - **Boundary**: Encapsulates Menu Items, Categories, Modifier Groups, and Price Tiers for a given catalog or location.
   - **Invariants**: A modifier group cannot enforce a `min_selection` greater than its total available modifiers.

3. **Order**
   - **Boundary**: Encapsulates Order Lines, Cart State, applied Taxes, Discounts, and Fulfillment status (e.g., Dine-In, Delivery).
   - **Invariants**: Cannot transition to "Accepted" without a fully funded Payment Intent. The total amount must never be negative.

4. **Customer (Guest)**
   - **Boundary**: Encapsulates contact information, marketing preferences, dietary restrictions, and loyalty points ledger.
   - **Invariants**: Identifying credentials (Email/Phone) must be unique per Tenant. The points ledger cannot drop below zero.

5. **Payment**
   - **Boundary**: Encapsulates the Payment Intent, Gateway Transactions, and associated Refunds.
   - **Invariants**: The total refunded amount across all refunds cannot exceed the original captured payment amount.

6. **Inventory**
   - **Boundary**: Encapsulates Ingredients, Recipes (Bill of Materials), and Stock Movements for a specific location.
   - **Invariants**: The current stock level must strictly match the aggregated sum of all historical stock movements.

7. **Reservation**
   - **Boundary**: Encapsulates the booking timeframe, party size, assigned table(s), and guest details.
   - **Invariants**: Cannot assign overlapping time slots to the same physical table.

8. **Invoice**
   - **Boundary**: Encapsulates line items for SaaS billing (e.g., base subscription fee, SMS usage fees) and payment status.
   - **Invariants**: Once issued/finalized, an invoice becomes mathematically immutable. Any corrections require a separate Credit Note.

9. **Subscription**
   - **Boundary**: Encapsulates the active plan tier, billing cycle timeframe, and feature entitlements for a Tenant.
   - **Invariants**: A Tenant cannot have multiple concurrently active subscriptions for the same SaaS product.

10. **Notification**
    - **Boundary**: Encapsulates the message payload, target delivery channels (Email/SMS/Push), and dispatch status.
    - **Invariants**: A distinct notification instance can only be dispatched successfully once.
