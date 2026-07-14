# Security Architecture

The Security Architecture establishes the foundational defenses protecting the platform, tenant data, and end-users from malicious actors and accidental vulnerabilities. Security is deeply integrated into the framework, preventing developers from bypassing critical controls.

## Application Security

- **Headers**: All HTTP responses include strict security headers (e.g., `Strict-Transport-Security`, `X-Content-Type-Options`, `Content-Security-Policy` (CSP)) via tools like Helmet to mitigate clickjacking and MIME-sniffing.
- **CORS**: Cross-Origin Resource Sharing is strictly configured. Public APIs allow `*`, but authenticated storefronts and admin panels only allow specific, verified origins (e.g., the tenant's custom domain).
- **Rate Limiting**: IP-based and Tenant-based rate limiting prevents brute force attacks and noisy neighbor problems. Strict limits apply to sensitive endpoints (e.g., login, password reset, checkout).
- **CSRF**: Cross-Site Request Forgery is prevented using SameSite cookie attributes (`SameSite=Lax` or `Strict`) and CSRF tokens for mutating state via standard form submissions (when not using pure JSON APIs with Authorization headers).
- **XSS**: Cross-Site Scripting is mitigated by default through modern UI frameworks (React/Next.js) that auto-escape rendering. CSP further restricts inline scripts and unauthorized domains.
- **SQL Injection**: Prevented globally by strictly using the ORM (Prisma/Drizzle) for all database interactions. Raw SQL queries are heavily audited and must use parameterized inputs.

## Data Protection & Secrets

- **Encryption**: Data at rest is encrypted using AES-256 (handled by the cloud provider). Data in transit is strictly enforced over TLS 1.2+ (HTTPS/WSS).
- **Secrets Management**: Credentials, API keys, and certificates are never hardcoded. They are injected at runtime via environment variables managed by a secure vault (e.g., AWS Secrets Manager, GitHub Secrets).

## Authentication & Authorization

- **Password Policy**: Enforces strong passwords (min 8 chars, mixed case, numbers, symbols) and checks against known breached passwords (e.g., HIBP). Passwords are hashed using bcrypt or Argon2 with strong work factors.
- **API Keys**: B2B integrations use scoped, easily revokable API keys. Keys are stored as cryptographic hashes in the database; the raw key is only shown once upon creation.
- **Webhooks**: Outbound webhooks are signed using a cryptographic HMAC signature (e.g., using a shared secret). The receiver can verify the signature to ensure the webhook originated from our platform and the payload wasn't tampered with.
