# Core Platform Architecture

The Core Platform is the framework-independent heart of the Restaurant SaaS ecosystem. It encapsulates the fundamental business rules, domain entities, and abstract infrastructure contracts, ensuring consistency across all consuming applications (Admin, Dashboard, Menus, Kiosks, APIs, Workers, and Mobile).

## Core Responsibilities
- **Domain Enforcement**: Enforces business rules (e.g., pricing, availability, tax calculation) uniformly.
- **Abstract Contracts**: Defines interfaces for external services (storage, payments, notifications) without coupling to specific providers.
- **State & Lifecycle**: Manages global initialization, dependency resolution, and application teardown.
- **Multi-Tenancy**: Contextualizes operations by Restaurant ID, ensuring strict data isolation.

## Module Boundaries
- **`entities/`**: Pure domain models (Restaurant, Product, Order) devoid of persistence logic.
- **`use-cases/`**: Application logic orchestrating entities and ports (e.g., `PlaceOrderUseCase`).
- **`ports/`**: Interfaces defining how the core interacts with the outside world (e.g., `IPaymentGateway`).
- **`shared/`**: Global constants, error classes, and primitive types (e.g., Money, GeoLocation).

## Dependency Rules
1. **Inward Dependency Only**: Outer layers (UI, Web Frameworks, DB Adapters) depend on the Core. The Core depends on *nothing* outside of itself.
2. **No Frameworks**: The Core must not import Next.js, NestJS, React, or Prisma. Only pure TypeScript/JavaScript.
3. **Dependency Injection**: All external dependencies (Database, Logger, Stripe) must be injected into the Core via Port interfaces.

## Folder Structure
```
core/
├── entities/       # Pure domain objects
├── value-objects/  # Immutable domain concepts (Money, Address)
├── use-cases/      # Application specific business rules
├── ports/          # Interfaces for driving/driven adapters
├── exceptions/     # Domain specific error types
├── config/         # Validation schemas for core config
└── index.ts        # Public API facade
```

## Initialization Flow
1. **Bootstrapping**: The host application (e.g., Next.js server or NestJS API) starts.
2. **Adapter Instantiation**: Host creates instances of concrete adapters (e.g., `PostgresOrderRepository`, `StripePaymentAdapter`).
3. **Core Registry**: Host registers adapters into the Core's Dependency Injection container (or manual factory functions).
4. **Validation**: Core validates configuration and adapter compliance.
5. **Ready State**: Core emits a `SystemReady` event; host begins accepting traffic.

## Lifecycle
- **Setup**: Reading environment, binding adapters.
- **Running**: Handling stateless requests or pub/sub events.
- **Graceful Shutdown**: Core signals adapters to close connections (DB pools, Redis sockets) before process exit.

## Dependency Graph
```
[ Web / Mobile UI ] --> [ API / Controllers ]
                              |
                              v
                      [ Core Use Cases ]
                              |
                     [ Core Entities ]
                              ^
                              |
[ DB Adapters ] ------(implement ports)------ [ 3rd Party Adapters ]
```
