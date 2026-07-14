# Audit Logging Architecture

The Audit Logging architecture provides a definitive, immutable record of all critical state changes and security events within the platform. It ensures accountability, aids in compliance (e.g., SOC2, GDPR), and accelerates forensic debugging.

## Core Concepts

- **Immutability**: Audit logs are append-only. Once a log is written, it cannot be modified or deleted, even by system administrators.
- **Contextual Enrichment**: Every log entry captures "Who did What, When, Where, and Why". This includes User ID, Tenant ID, IP Address, Timestamp, Action, Resource ID, and a diff of changes.
- **Asynchronous Processing**: Writing audit logs should never block the primary business transaction. Logs are emitted as events and persisted asynchronously via background workers or a dedicated logging service.

## Tracked Events

- **Authentication**: Logins, logouts, password resets, MFA enrollment, and failed login attempts (to detect brute force).
- **Users & RBAC**: Creation, deletion, role assignments, and permission changes.
- **Restaurants & Settings**: Onboarding, subscription changes, operating hours updates, and modifications to global tenant settings.
- **Menu Changes**: Price adjustments, item availability toggles, category reorganization, and allergen information updates (critical for liability).
- **Orders & Payments**: Order state transitions (placed, accepted, fulfilled, canceled), refunds issued, and payment gateway interactions.

## Data Structure & Storage

- **Schema**: Logs are structured as JSON documents to allow for flexible payloads (e.g., storing the `previous_state` and `new_state` of an edited menu item).
- **Hot vs. Cold Storage**: Recent logs (e.g., last 30-90 days) are stored in a fast, indexed datastore (like Elasticsearch or PostgreSQL JSONB) for immediate querying via the Admin Dashboard. Older logs are archived to cold storage (e.g., Amazon S3 Glacier) for long-term compliance retention.

## Compliance & Security

- **PII Redaction**: Personally Identifiable Information (PII) such as credit card numbers or raw passwords are never logged. Email addresses and phone numbers are obfuscated or hashed if not strictly necessary for the audit context.
- **Integrity**: Logs can be cryptographically signed or periodically hashed and anchored to a tamper-evident ledger to prove they haven't been altered.
