# Configuration System Architecture

The centralized Configuration System is a foundational component that manages how the platform behaves across different environments, features, and tenants. It ensures strong typing, strict validation, and hierarchical resolution of settings.

## Configuration Domains

- **Environment Configuration**: OS-level environment variables (`.env`). Strictly typed and validated at application startup.
- **Application Configuration**: Build-time and deploy-time settings that define global platform behavior (e.g., region, log levels).
- **Restaurant Configuration (Tenant)**: Runtime settings specific to a tenant (e.g., opening hours, tax rates, accepted payment methods). Usually fetched from the database or cache.
- **Feature Configuration**: Granular feature flags and toggles allowing progressive rollouts and A/B testing.
- **Secrets Management**: Secure storage and retrieval of sensitive data (API keys, DB credentials). Never checked into source control; fetched via secure providers (e.g., AWS Secrets Manager, Doppler).

## Typed Config & Validation

- **Strong Typing**: All configurations are resolved into strict TypeScript interfaces.
- **Runtime Validation**: Use Zod (or Joi) to validate all environment variables and remote payloads at startup. If validation fails, the system fast-fails to prevent misconfigured deployments.

## Configuration Hierarchy & Overrides

Resolution follows a strict order of precedence (highest to lowest):
1. **Runtime Overrides** (e.g., Admin dashboard manual overrides)
2. **Restaurant Specific Config** (DB/Redis)
3. **Environment Variables** (OS/Container)
4. **Environment-Specific Files** (`config.production.json`)
5. **Default Application Config** (`config.default.json`)

## Environment Lifecycles

- **Development**: Relies on local `.env` files and local overrides to allow developer flexibility without impacting others.
- **Testing**: Uses mocked configurations and deterministic seed values. Strict isolation to prevent side effects.
- **Production**: Immutable deploy-time environment variables combined with dynamic, cached runtime configurations (Redis). Secrets are injected at runtime by the infrastructure provider.
