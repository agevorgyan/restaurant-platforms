# Tenant Resolution Architecture

Tenant Resolution is the critical first step in our multi-tenant SaaS platform. It securely identifies which tenant (restaurant or franchise group) context a request or background task belongs to before granting access to data or executing logic.

## Routing Mechanisms

- **Subdomain Routing**: The standard approach for hosted storefronts and admin panels (e.g., `burgerjoint.platform.com`). The Tenant ID is resolved by parsing the `Host` HTTP header.
- **Custom Domain Routing**: Allows tenants to use their own domains (e.g., `www.burgerjoint.com`). Resolved by querying an edge-cached lookup table mapping the `Host` header to the internal Tenant ID.
- **API Resolution**: B2B API clients and mobile apps explicitly pass the tenant context using an `X-Tenant-ID` HTTP header. If omitted, the system falls back to extracting the tenant context from the authenticated user's JWT token.

## Asynchronous & Stateful Resolution

- **Background Jobs & Workers**: Messages pulled from message brokers or job queues lack HTTP context. Therefore, the `TenantId` **must** be explicitly embedded within the root payload of every event or job struct. The worker extracts this ID to set its execution context.
- **WebSockets**: Real-time connections are resolved during the initial HTTP Upgrade handshake. The tenant is identified via a query parameter (e.g., `?tenantId=xyz`) or an auth token. Once the connection is established, the socket object is statefully bound to that Tenant ID in memory, avoiding re-resolution per message.

## Security & Context Isolation

Once resolved, the Tenant ID is securely injected into the execution context (e.g., Node.js `AsyncLocalStorage` or request object). All subsequent database queries, cache lookups, and third-party API calls implicitly use this context to ensure strict data isolation and prevent cross-tenant data leaks.
