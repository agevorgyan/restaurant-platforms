/**
 * Enterprise Tenant Provisioning Platform - Domain Enums
 *
 * Defines core domain enumerations for tenant types, lifecycle stages,
 * resource types, provisioning status states, and initialization step states.
 */

export enum TenantType {
  TRIAL = 'TRIAL',
  STANDARD = 'STANDARD',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
  PARTNER = 'PARTNER',
  FRANCHISE = 'FRANCHISE',
  SANDBOX = 'SANDBOX',
}

export enum LifecycleStage {
  PROVISIONING = 'PROVISIONING',
  INITIALIZING = 'INITIALIZING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
}

export enum ResourceType {
  DATABASE_SCHEMA = 'DATABASE_SCHEMA',
  STORAGE = 'STORAGE',
  QUEUES = 'QUEUES',
  CACHE = 'CACHE',
  AI_QUOTA = 'AI_QUOTA',
  ANALYTICS_WORKSPACE = 'ANALYTICS_WORKSPACE',
  INTEGRATION_WORKSPACE = 'INTEGRATION_WORKSPACE',
  MEDIA_STORAGE = 'MEDIA_STORAGE',
}

export enum ProvisioningStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  ROLLED_BACK = 'ROLLED_BACK',
}

export enum InitializationStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
  FAILED = 'FAILED',
}
