# Enterprise Connector Platform

The **Enterprise Connector Platform** manages connector lifecycle, capabilities, health monitoring, versioning, and inventory for an Enterprise Restaurant SaaS ERP platform.

---

## Key Principles & Design Boundaries

1. **Connector Lifecycle Ownership**: The platform owns connector registration, configuration, capability discovery, health scoring, SemVer versioning, and state transitions.
2. **NO Payload Transformation & NO HTTP Execution**: Payload transformations and low-level HTTP transport are explicitly owned by the HTTP & API Integration Platform (Task 33.2).
3. **ZERO Raw Credential Storage**: Connector credentials (API keys, client secrets, bearer tokens) are **NEVER** stored in this platform. Only `ConnectorCredentialReference` objects (Vault ARNs or key references) resolved through the Enterprise Secrets Platform are stored.
4. **Hexagonal & DDD Architecture**: Domain core is framework-independent, utilizing Value Objects, Aggregates, Domain Events, and Ports & Adapters.

---

## Connector Types & Capabilities

### Connector Types
- `PAYMENT`: Payment gateway integrations (Stripe, Adyen, Square)
- `DELIVERY`: Third-party delivery aggregators (UberEats, DoorDash, Deliveroo)
- `POS`: Point-of-Sale systems (Toast, Clover, Lightspeed)
- `ERP`: Enterprise Resource Planning (SAP, NetSuite, Odoo)
- `CRM`: Customer Relationship Management (Salesforce, HubSpot)
- `ACCOUNTING`: Financial accounting software (QuickBooks, Xero)
- `GOVERNMENT`: Tax & e-invoicing government gateways
- `NOTIFICATION`: Messaging gateways (Twilio, SendGrid, Firebase)
- `STORAGE`: Cloud storage providers (AWS S3, GCP GCS, Azure Blob)
- `IDENTITY_PROVIDER`: SSO & Identity providers (Okta, Auth0, Azure AD)
- `AI_PROVIDER`: Generative & Predictive AI services (OpenAI, Vertex AI)
- `CUSTOM`: Tenant-specific custom connectors

### Connector Capabilities
- `READ`, `WRITE`, `WEBHOOK`, `STREAMING`, `BATCH`, `POLLING`, `OAUTH`, `PUSH`, `PULL`

---

## Lifecycle State Machine

```
   [DRAFT] 
      │
      ▼ (configure)
[CONFIGURED]
      │
      ▼ (connect)
 [CONNECTED] ───► [HEALTHY] ◄───► [DEGRADED]
      │
      ▼ (disconnect / disable)
[DISCONNECTED] / [DISABLED]
      │
      ▼ (archive)
  [ARCHIVED]
```

### Supported States
- `Draft`: Initial registration of connector template/definition.
- `Configured`: Configuration settings, endpoints, and `ConnectorCredentialReference` attached.
- `Connected`: Connectivity validated against target external system endpoint.
- `Healthy`: Active monitoring with high health score (Score ≥ 70).
- `Degraded`: Active monitoring with degraded latency/failure rate (40 ≤ Score < 70).
- `Disconnected`: Manually or automatically disconnected instance.
- `Disabled`: Disabled by policy or administrator action.
- `Archived`: Terminal state.

---

## Domain Events

- `ConnectorRegistered`: Emitted when a new connector aggregate is created.
- `ConnectorConfigured`: Emitted when settings and Vault secret references are attached.
- `ConnectorConnected`: Emitted when connectivity checks succeed.
- `ConnectorDisconnected`: Emitted when a connector is disconnected.
- `ConnectorHealthChanged`: Emitted when health score crosses status thresholds.
- `ConnectorVersionPublished`: Emitted when SemVer version is upgraded.
- `ConnectorDisabled`: Emitted when a connector is administrative disabled.
- `HealthCheckCompleted`: Emitted after each automated or manual health check cycle.

---

## REST API Endpoints

All endpoints are hosted at `/integrations/connectors`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/integrations/connectors` | List connectors with tenant & query filters |
| `GET` | `/integrations/connectors/:id` | Get connector details by ID |
| `POST` | `/integrations/connectors` | Register new connector (Draft state) |
| `PATCH` | `/integrations/connectors/:id` | Configure settings & credential reference |
| `POST` | `/integrations/connectors/:id/connect` | Connect instance to external endpoint |
| `POST` | `/integrations/connectors/:id/disconnect` | Disconnect connector instance |
| `GET` | `/integrations/connectors/health` | Query real-time health dashboard |
| `GET` | `/integrations/connectors/statistics` | Retrieve operational metrics & statistics |
| `GET` | `/integrations/connectors/catalog` | Browse connector catalog |
| `GET` | `/integrations/connectors/capabilities` | Capability discovery catalog |
| `GET` | `/integrations/connectors/inventory` | Tenant connector inventory |

---

## Security & Validation Rules

1. **Tenant Isolation**: Every connector instance is scoped by `tenantId`.
2. **Secret Reference Verification**: Raw secrets in `secretArn` are strictly rejected by `ConnectorCredentialReference`.
3. **SemVer Validation**: Version upgrades must be strictly greater than current version.
4. **HTTPS Endpoint Enforcement**: All endpoint URLs must start with `https://`.
5. **Signed Metadata**: Connector metadata supports HMAC-SHA256 signature verification.
