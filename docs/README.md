# Documentation Structure

The documentation in this repository is structured to provide a comprehensive, centralized knowledge base. Every document serves a specific purpose to align engineering, product, and design.

- **README.md**: The entry point. Vision, tech stack, prerequisites, and local setup.
- **CONTRIBUTING.md**: Onboarding guide, Git branching strategy, semantic versioning, PR rules.
- **ARCHITECTURE.md**: System design, boundaries, event-driven flows, and ADR links.
- **API.md**: REST/GraphQL contracts, authentication flows, rate limits, WebSockets.
- **DEPLOYMENT.md**: CI/CD pipeline, Docker orchestration, and rollback procedures.
- **SECURITY.md**: Secret management, vulnerabilities, compliance standards, audit logging.
- **DATABASE.md**: Prisma schema rationale, multi-tenant isolation, caching, backups.
- **CODING_STANDARDS.md**: Naming conventions, folder structures, architectural patterns.
- **UI_GUIDELINES.md**: Design philosophy, Tailwind conventions, accessibility, motion.
- **CHANGELOG.md**: Chronological list of notable changes for each release.
- **ROADMAP.md**: High-level product vision, upcoming epics, tech debt reduction.

## Directory Structure

```text
restaurant-platform/
├── apps/
│   ├── admin/
│   ├── dashboard/
│   ├── api/
│   ├── customer-menu/
│   ├── customer-order/
│   ├── customer-kiosk/
│   ├── landing/
│   └── docs/
├── packages/
│   ├── ui/
│   ├── theme/
│   ├── api-client/
│   ├── database/
│   ├── auth/
│   ├── types/
│   ├── config/
│   ├── utils/
│   ├── analytics/
│   ├── payments/
│   ├── storage/
│   ├── notifications/
│   ├── ai/
│   ├── shared/
│   ├── localization/
│   ├── validation/
│   └── hooks/
├── docker/
├── docs/
├── scripts/
└── .github/
```
- **DESIGN_TOKENS.md**: Spacing, radius, elevation, transitions, and breakpoints architecture.
- **TYPOGRAPHY.md**: Semantic typography roles, scale, and naming conventions.
- **COLOR_SYSTEM.md**: Semantic color palette, theming logic, and accessibility constraints.
- **PRODUCT_CARD_UX.md**: UX rules for the core menu item component.
- **CATEGORY_NAVIGATION_UX.md**: Behavior rules for the horizontal category navigation.
- **BOTTOM_NAVIGATION_UX.md**: UX rules for the primary mobile navigation layer and floating cart.
- **CHECKOUT_FLOW_UX.md**: UX rules for a high-converting, friction-free checkout experience.
- **MOTION_SYSTEM.md**: Animation philosophy, micro-interactions, and loading states.
- **DESIGN_SYSTEM_REVIEW.md**: Enterprise-grade review addressing multi-tenancy, i18n, and scalability.
- **COMPONENT_LIBRARY.md**: Directory structure and architecture for the shared UI package.
- **UI_KIT_ARCHITECTURE.md**: Architecture principles for the reusable React UI Kit.
- **BUTTON_ARCHITECTURE.md**: Architectural blueprint for the Button component, variants, and accessibility.
- **PRODUCT_CARD_ARCHITECTURE.md**: Comprehensive component architecture for the Product Card.
- **FLOATING_CART_ARCHITECTURE.md**: Architectural blueprint for the persistent Floating Cart component.
- **BOTTOM_SHEET_ARCHITECTURE.md**: Architecture blueprint for the mobile-first Bottom Sheet overlay.
- **SEARCH_ARCHITECTURE.md**: Architecture blueprint for the Search experience, autocomplete, and accessibility.
- **MENU_NAVIGATION_ARCHITECTURE.md**: Architecture blueprint for the sticky, scroll-spying Menu Navigation.
- **THEME_ENGINE_ARCHITECTURE.md**: Architecture blueprint for the multi-tenant, CSS-variable driven Theme Engine.
- **THEME_ENGINE_ARCHITECTURE.md**: Architecture blueprint for the CSS-variable driven Theme Engine.
- **PACKAGES_ARCHITECTURE.md**: Monorepo package structure and domain boundaries.
- **CORE_PLATFORM_ARCHITECTURE.md**: Framework-independent Core Platform architecture.
- **CONFIGURATION_SYSTEM_ARCHITECTURE.md**: Architecture blueprint for the centralized Configuration System.
- **LOGGING_ARCHITECTURE.md**: Architecture blueprint for structured enterprise logging and observability.
- **ERROR_HANDLING_ARCHITECTURE.md**: Global error handling, HTTP mapping, and logging strategies.
- **API_CONTRACT_STANDARDS.md**: API architecture, REST rules, response shapes, and validation.
- **SHARED_TYPES_ARCHITECTURE.md**: Foundational domain primitives and entity shapes.
- **EVENT_DRIVEN_ARCHITECTURE.md**: Event Bus architecture, idempotency, retries, and DLQ.
- **FEATURE_FLAG_ARCHITECTURE.md**: Feature Flag architecture, scopes, rollouts, and evaluation.
- **TENANT_RESOLUTION_ARCHITECTURE.md**: Strategies for identifying tenant context across HTTP, WS, and workers.
- **RBAC_ARCHITECTURE.md**: Enterprise Role-Based Access Control, policies, scopes, and ABAC readiness.
- **LOCALIZATION_ARCHITECTURE.md**: i18n, formatting, RTL, and translation strategies.
- **SECURITY_ARCHITECTURE.md**: Headers, CORS, CSRF, Rate Limiting, and Encryption.
- **AUDIT_LOGGING_ARCHITECTURE.md**: Immutability, contextual tracking, and compliance storage.
- **ARCHITECTURE_REVIEW.md**: Critical review identifying coupling, scalability, and duplicated responsibilities.
- **BOUNDED_CONTEXTS.md**: Domain-Driven Design bounded contexts, entities, and public APIs.
- **AGGREGATE_ROOTS.md**: Definitions of core Aggregate Roots and transactional boundary rules.
- **ENTITIES.md**: Core domain entities and strict ownership lifecycle rules.
- **VALUE_OBJECTS.md**: Reusable value objects and strict validation rules.
- **REPOSITORY_ARCHITECTURE.md**: Repository patterns, CQRS, pagination, and caching standards.
- **DOMAIN_EVENTS.md**: Core domain events and strict naming conventions.
- **TRANSACTION_STRATEGY.md**: Transaction boundaries, Sagas, compensating transactions, and idempotency.
- **CQRS_EVALUATION.md**: Strategic evaluation of where to apply CQRS vs standard CRUD.
- **DATABASE_STRATEGY.md**: Database normalization, indexing, caching, and auditing.
- **DOMAIN_ARCH_REVIEW.md**: Architectural review, bottleneck identification, and enterprise improvements.
- **TURBOREPO_ARCHITECTURE.md**: Monorepo structure, package graph, and architectural boundaries.
- **DOCKER_INFRASTRUCTURE.md**: Multi-stage Docker builds, Compose configurations, and networking.
- **DOCKER_INFRASTRUCTURE.md**: Multi-stage Docker builds, Compose configurations, and networking.
- **PRISMA_CONFIGURATION.md**: Prisma schema, client singleton, repository pattern, and seeding.
- **PRISMA_CONFIGURATION.md**: Prisma schema, client singleton, repository pattern, and seeding.
