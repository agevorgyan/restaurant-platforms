// ─── Gateway core ─────────────────────────────────────────────────────────────
export * from './gateway-core';

// ─── Event bus core ───────────────────────────────────────────────────────────
export * from './event-bus-core';

// ─── Webhook core ─────────────────────────────────────────────────────────────
export * from './webhook-core';

// ─── Connector core (DomainPrimitive-based VOs) ───────────────────────────────
export * from './connector-core';

// ─── Connector VO (richer extended VOs — only non-duplicate names) ────────────
export {
  ConnectorName,
  ConnectorTypeVO,
  ConnectorCapabilityVO,
  ConnectorCredentialReferenceProps,
  ConnectorCredentialReference,
  HealthScore,
  ConnectorHealthProps,
  ConnectorStatusVO,
  ConnectorMetadataProps,
  ConnectorMetadata,
} from './connector-vo';

// ─── Workflow core ────────────────────────────────────────────────────────────
export * from './workflow-core';

// ─── Identity core ────────────────────────────────────────────────────────────
export * from './identity-core';

// ─── Developer core (ApiVersion aliased to avoid conflict with gateway-core) ──
export {
  DeveloperId,
  ApplicationId,
  ApiProductId,
  ApiVersion as DeveloperApiVersion,
  SdkVersion,
  SandboxEnvironmentEnum,
  SandboxEnvironment,
  ApiCredentialProps,
  ApiCredential,
  DeveloperSubscriptionProps,
  DeveloperSubscription,
} from './developer-core';
