# Tenant Resolver Module

Enterprise-grade, highly performant multi-tenant resolution and request scoping engine for a global-scale Restaurant SaaS Platform.

## 🏗️ Architectural Overview

The Tenant Resolver guarantees secure logical data isolation within a single shared database instance. It abstracts host parsing, domain discovery, context propagation, and request-level isolation from our core business services and controllers.

```
┌────────────────────────────────────────────────────────┐
│                   Inbound HTTP Request                 │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│               TenantResolverMiddleware                 │
│  - Captures Host / Custom Domain / Subdomains / Headers│
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│                TenantResolverService                   │
│  - Executes cached or database-backed lookup queries   │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│                   TenantContext (ALS)                  │
│  - Wraps execution using AsyncLocalStorage context      │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│               Access Control (TenantGuards)            │
│  - Hardens boundary to prevent cross-tenant data leaks │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│            Isolated Controller / Service Layer         │
│  - Accesses TenantContext.getTenantId() statically     │
└────────────────────────────────────────────────────────┘
```

---

## ⚡ Key Features

*   **Subdomain Resolution**: Detects `tenant-id.saas.com` pattern and resolves the tenant automatically.
*   **Custom Domain Resolution**: Supports white-labeled domain matching (e.g., `order.bistro.com`) by matching the full hostname.
*   **Ambient Scope Tracking (`AsyncLocalStorage`)**: Removes the need to pass `tenantId` as method parameters across services and repositories. Access context parameters statically anywhere in the thread stack.
*   **Local High-Performance Cache**: Internally caches resolved hostname mappings with customizable TTL to minimize database pressure and handle extreme load surges.
*   **Rigid Tenant Security Guards**: Built-in firewall protecting against Cross-Tenant Data Leakage by comparing authenticated users' memberships with the request boundaries.
*   **Nested Restaurant Resolution**: Leverages REST-path matching and query/header overrides to resolve active store scopes securely.

---

## 📘 API Reference & Usage

### 1. Configuration & Options
Configure the resolver using the `TenantResolverOptions` schema:

```typescript
export interface TenantResolverOptions {
  primaryDomain: string;        // The root domain (e.g., 'localhost:3000' or 'restaurantsaas.com')
  enableSubdomains?: boolean;    // Toggle subdomain-based resolution
  enableCustomDomains?: boolean;  // Toggle custom external domain matching
  headerKeys?: {
    tenantId?: string;           // Custom header to read tenant (default: 'x-tenant-id')
    restaurantId?: string;       // Custom header to read restaurant (default: 'x-restaurant-id')
  };
  cookieKeys?: {
    tenantId?: string;           // Custom cookie key (default: 'tenant_id')
    restaurantId?: string;       // Custom cookie key (default: 'restaurant_id')
  };
  fallbackTenantId?: string;     // Default/sandbox tenant (optional)
}
```

### 2. Initializing & Registering Middleware
Attach the middleware inside your main express entry point (`server.ts`):

```typescript
import { TenantResolverService, createTenantResolverMiddleware } from './modules/tenant-resolver';

const tenantResolverService = new TenantResolverService(
  {
    primaryDomain: 'localhost:3000',
    enableSubdomains: true,
    enableCustomDomains: true,
  },
  tenantRepository,
  restaurantRepository
);

app.use(createTenantResolverMiddleware(tenantResolverService));
```

### 3. Static Context Access
Retrieve context keys at any layer (Service, Handler, Repository):

```typescript
import { TenantContext } from './modules/tenant-resolver';

export class OrderService {
  async listOrders() {
    // Zero parameter passing! Statically scoped:
    const tenantId = TenantContext.getTenantId();
    const restaurantId = TenantContext.getRestaurantId();

    return prisma.order.findMany({
      where: { tenantId, restaurantId }
    });
  }
}
```

### 4. Securing Routes with Guards
Harden routes by chaining guards after authentication middlewares:

```typescript
import { TenantGuards } from './modules/tenant-resolver';

// Enforce that a route is scoped to the logged-in tenant only
router.get('/orders', TenantGuards.requireTenant, TenantGuards.enforceTenantAccess, orderController.getOrders);

// Enforce that a route requires active store scoping
router.get('/menu', TenantGuards.requireRestaurant, menuController.getMenu);
```

---

## 🛑 Error Codes & Exceptions

When resolution fails, the middleware returns standardized JSON payloads with a `4xx` status code:

| Exception Class | HTTP Status | Error Code | Reason / Description |
| :--- | :--- | :--- | :--- |
| `TenantNotFoundException` | `404` | `TENANT_NOT_FOUND` | No matching tenant resolved via domain, subdomains, headers, or cookies. |
| `RestaurantNotFoundException` | `404` | `RESTAURANT_NOT_FOUND` | The specified restaurant is either missing or belongs to a different tenant. |
| `TenantMismatchException` | `403` | `TENANT_MISMATCH` | Authenticated user is attempting to query resources from a different tenant organization. |
| `InvalidDomainException` | `400` | `INVALID_DOMAIN_FORMAT` | The provided hostname or domain format violates system rules. |

---

## 📈 Monitoring Hooks & Telemetry

The Tenant Resolver includes support for:
1.  **Audits**: Warning logs are automatically written for any rejected cross-tenant database access attempts.
2.  **Telemetry Correlation**: The unique request `correlationId` is bound into the context storage, allowing distributed tracing across subsequent logs and network transactions.
