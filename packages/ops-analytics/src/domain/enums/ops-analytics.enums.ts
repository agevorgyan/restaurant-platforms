/**
 * Enterprise Restaurant Operations Analytics Platform - Domain Enums
 *
 * Defines core domain enumerations for metric health statuses and aggregation time windows.
 */

export enum MetricStatus {
  HEALTHY = 'HEALTHY',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

export enum TimeWindow {
  REAL_TIME = 'REAL_TIME',
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}
