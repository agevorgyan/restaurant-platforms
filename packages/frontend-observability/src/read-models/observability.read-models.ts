/**
 * Enterprise Frontend Performance & Observability Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Web Vitals Overview, Active Traces, Error Log Reports,
 * Real User Monitoring (RUM) Sessions, and Performance Budget Compliance.
 */

import { ErrorSeverity, MetricType } from '../domain/enums/observability.enums';

export interface WebVitalsSummaryReadModel {
  metricType: MetricType;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  recordedAt: string;
}

export interface WebVitalsOverviewReadModel {
  totalMetricsRecorded: number;
  overallHealthScore: number; // 0..100
  metrics: WebVitalsSummaryReadModel[];
}

export interface ActiveTracesReadModel {
  totalActiveTracesCount: number;
  traces: Array<{
    traceId: string;
    spanId: string;
    name: string;
    durationMs: number;
  }>;
}

export interface ErrorReportReadModel {
  totalErrorsCount: number;
  bySeverity: Record<ErrorSeverity, number>;
  recentErrors: Array<{
    errorId: string;
    message: string;
    severity: ErrorSeverity;
    componentName?: string;
    timestamp: string;
  }>;
}

export interface RumSessionReadModel {
  sessionId: string;
  userAgent: string;
  pageViewsCount: number;
  averagePageLoadTimeMs: number;
  totalErrorsEncountered: number;
}

export interface BudgetComplianceReadModel {
  totalBudgetsMonitored: number;
  compliantBudgetsCount: number;
  violatedBudgetsCount: number;
  budgets: Array<{
    budgetId: string;
    targetMetric: MetricType;
    maxThresholdValue: number;
    actualValue: number;
    isCompliant: boolean;
  }>;
}
