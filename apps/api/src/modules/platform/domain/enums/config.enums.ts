/**
 * Enterprise Distributed Configuration Platform - Domain Enums
 *
 * Defines core domain enumerations for configuration types, environments,
 * lifecycle status states, and propagation status states.
 */

export enum ConfigurationType {
  APPLICATION = 'APPLICATION',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  INTEGRATION = 'INTEGRATION',
  AI = 'AI',
  ANALYTICS = 'ANALYTICS',
  AUTOMATION = 'AUTOMATION',
  PLATFORM = 'PLATFORM',
  TENANT = 'TENANT',
}

export enum EnvironmentType {
  DEVELOPMENT = 'DEVELOPMENT',
  TESTING = 'TESTING',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
  SANDBOX = 'SANDBOX',
  LOCAL = 'LOCAL',
}

export enum ConfigurationStatus {
  DRAFT = 'DRAFT',
  VALIDATED = 'VALIDATED',
  PUBLISHED = 'PUBLISHED',
  DEPRECATED = 'DEPRECATED',
  ARCHIVED = 'ARCHIVED',
}

export enum PropagationStatus {
  PENDING = 'PENDING',
  PROPAGATING = 'PROPAGATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}
