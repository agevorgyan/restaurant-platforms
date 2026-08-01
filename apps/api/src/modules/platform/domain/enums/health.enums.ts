/**
 * Enterprise Platform Health & Operations Platform - Domain Enums
 *
 * Defines core domain enumerations for health check categories, check types,
 * service status states, and health severity levels.
 */

export enum HealthType {
  APPLICATION = 'APPLICATION',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  DATABASE = 'DATABASE',
  QUEUE = 'QUEUE',
  INTEGRATION = 'INTEGRATION',
  AI_PLATFORM = 'AI_PLATFORM',
  ANALYTICS = 'ANALYTICS',
  TENANT = 'TENANT',
}

export enum CheckType {
  LIVENESS = 'LIVENESS',
  READINESS = 'READINESS',
  STARTUP = 'STARTUP',
  DEPENDENCY = 'DEPENDENCY',
  SYNTHETIC = 'SYNTHETIC',
  HEARTBEAT = 'HEARTBEAT',
}

export enum ServiceStatus {
  UNKNOWN = 'UNKNOWN',
  STARTING = 'STARTING',
  HEALTHY = 'HEALTHY',
  DEGRADED = 'DEGRADED',
  MAINTENANCE = 'MAINTENANCE',
  UNAVAILABLE = 'UNAVAILABLE',
  STOPPED = 'STOPPED',
}

export enum HealthSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
  EMERGENCY = 'EMERGENCY',
}
