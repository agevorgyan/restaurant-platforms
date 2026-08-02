/**
 * Enterprise Inventory Analytics Platform - Domain Enums
 *
 * Defines core domain enumerations for metric health statuses and analytics aggregation windows.
 */

export enum MetricStatus {
  HEALTHY = 'HEALTHY',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

export enum AnalyticsWindow {
  REAL_TIME = 'REAL_TIME',
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}
