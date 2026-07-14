# Feature Flag Architecture

The Feature Flag (Toggle) architecture enables safe, decoupled deployments by decoupling code releases from feature releases. It allows granular control over feature visibility and behavior based on various contexts (global, tenant, subscription).

## Flag Scopes & Contexts

- **Global Flags**: System-wide toggles (e.g., `maintenance_mode`, `new_checkout_flow`). Affects all tenants and users simultaneously. Usually used for big-bang releases or emergency kill switches.
- **Restaurant (Tenant) Flags**: Toggles scoped to a specific Restaurant ID. Allows opting individual locations into specific behaviors (e.g., `enable_kiosk_ordering`, `third_party_delivery_integration`).
- **Subscription (Tier) Flags**: Features enabled based on the tenant's billing tier (e.g., `advanced_analytics` only enabled for "Pro" plan). These are often derived automatically from the tenant's current subscription state rather than manually toggled.

## Rollout Strategies

- **Beta Features (Opt-in)**: Allows tenants or users to explicitly opt-in to experimental features via their settings dashboard before general availability.
- **Gradual Rollout (Canary)**: Features rolled out to a percentage of tenants (e.g., 5%, then 20%, then 100%) to monitor performance and error rates safely.
- **Experiments (A/B Testing)**: Traffic split between variants to measure business impact (e.g., conversion rate of a new menu layout).

## Architecture & Evaluation

1. **Centralized Provider**: A central service (e.g., LaunchDarkly, Unleash, or an internal Redis-backed service) stores flag rules.
2. **Evaluation Context**: Clients and backend services must provide context during evaluation (e.g., `{ restaurantId, userId, planId, country }`) so the provider can compute the flag state.
3. **Caching & Latency**: To prevent the flag provider from becoming a single point of failure or latency bottleneck, evaluated flags are heavily cached at the edge, in-memory, or synced locally via SSE (Server-Sent Events).
4. **Fallback (Defaults)**: If the flag provider is unreachable, the system must fast-fail to a safe default state defined in the codebase.

## Flag Lifecycle
Flags are temporary technical debt. Once a feature is 100% rolled out and stable, the flag *must* be removed from the codebase to keep the system clean.
