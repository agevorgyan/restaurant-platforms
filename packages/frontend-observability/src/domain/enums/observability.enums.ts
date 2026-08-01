/**
 * Enterprise Frontend Performance & Observability Platform - Domain Enums
 *
 * Defines core domain enumerations for Web Vitals metric types and error severity levels.
 */

export enum MetricType {
  FCP = 'FCP',
  LCP = 'LCP',
  CLS = 'CLS',
  INP = 'INP',
  TTI = 'TTI',
  API_LATENCY = 'API_LATENCY',
}

export enum ErrorSeverity {
  FATAL = 'FATAL',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO',
}
