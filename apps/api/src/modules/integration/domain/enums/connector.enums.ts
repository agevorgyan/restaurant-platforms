/**
 * Enterprise Connector Platform - Domain Enums
 *
 * Defines the core enumerations for connector classification,
 * state machine status values, and runtime capability declarations.
 */

/**
 * Supported connector integration categories across the enterprise platform.
 */
export enum ConnectorType {
  PAYMENT = 'PAYMENT',
  DELIVERY = 'DELIVERY',
  POS = 'POS',
  ERP = 'ERP',
  CRM = 'CRM',
  ACCOUNTING = 'ACCOUNTING',
  GOVERNMENT = 'GOVERNMENT',
  NOTIFICATION = 'NOTIFICATION',
  STORAGE = 'STORAGE',
  IDENTITY_PROVIDER = 'IDENTITY_PROVIDER',
  AI_PROVIDER = 'AI_PROVIDER',
  CUSTOM = 'CUSTOM',
}

/**
 * Deterministic lifecycle states of a connector instance.
 * State Machine transitions:
 * DRAFT -> CONFIGURED -> CONNECTED -> (HEALTHY | DEGRADED) -> DISCONNECTED | DISABLED | ARCHIVED
 */
export enum ConnectorStatus {
  DRAFT = 'DRAFT',
  CONFIGURED = 'CONFIGURED',
  CONNECTED = 'CONNECTED',
  HEALTHY = 'HEALTHY',
  DEGRADED = 'DEGRADED',
  DISCONNECTED = 'DISCONNECTED',
  DISABLED = 'DISABLED',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Functional capabilities supported by a connector definition or instance.
 */
export enum ConnectorCapability {
  READ = 'READ',
  WRITE = 'WRITE',
  WEBHOOK = 'WEBHOOK',
  STREAMING = 'STREAMING',
  BATCH = 'BATCH',
  POLLING = 'POLLING',
  OAUTH = 'OAUTH',
  PUSH = 'PUSH',
  PULL = 'PULL',
}
