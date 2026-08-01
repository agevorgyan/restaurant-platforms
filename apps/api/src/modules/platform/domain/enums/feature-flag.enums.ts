/**
 * Enterprise Feature Flag Platform - Domain Enums
 *
 * Defines core domain enumerations for flag types, targeting rule types,
 * rollout strategies, lifecycle status states, and evaluation resolution states.
 */

export enum FlagType {
  RELEASE_FLAG = 'RELEASE_FLAG',
  EXPERIMENT_FLAG = 'EXPERIMENT_FLAG',
  OPERATIONAL_FLAG = 'OPERATIONAL_FLAG',
  PERMISSION_FLAG = 'PERMISSION_FLAG',
  KILL_SWITCH = 'KILL_SWITCH',
  MIGRATION_FLAG = 'MIGRATION_FLAG',
  PREMIUM_FEATURE = 'PREMIUM_FEATURE',
  DEVELOPER_FLAG = 'DEVELOPER_FLAG',
}

export enum TargetType {
  GLOBAL = 'GLOBAL',
  ENVIRONMENT = 'ENVIRONMENT',
  TENANT = 'TENANT',
  RESTAURANT = 'RESTAURANT',
  DEPARTMENT = 'DEPARTMENT',
  USER = 'USER',
  ROLE = 'ROLE',
  SEGMENT = 'SEGMENT',
}

export enum RolloutType {
  FULL = 'FULL',
  PERCENTAGE = 'PERCENTAGE',
  CANARY = 'CANARY',
  GRADUAL = 'GRADUAL',
  SCHEDULED = 'SCHEDULED',
  MANUAL = 'MANUAL',
}

export enum FeatureStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  DEPRECATED = 'DEPRECATED',
  ARCHIVED = 'ARCHIVED',
}

export enum EvaluationResult {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
  CONDITIONAL = 'CONDITIONAL',
}
