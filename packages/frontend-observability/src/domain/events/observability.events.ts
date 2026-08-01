/**
 * Enterprise Frontend Performance & Observability Platform - Domain Events
 *
 * Domain events emitted during metric recording, trace lifecycle, error logging,
 * performance budget violations, and telemetry flushing.
 */

import { ErrorSeverity, MetricType } from '../enums/observability.enums';

export interface MetricRecordedEvent {
  eventName: 'MetricRecorded';
  metricType: MetricType;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: Date;
}

export interface TraceStartedEvent {
  eventName: 'TraceStarted';
  traceId: string;
  spanId: string;
  name: string;
  timestamp: Date;
}

export interface TraceEndedEvent {
  eventName: 'TraceEnded';
  traceId: string;
  spanId: string;
  durationMs: number;
  timestamp: Date;
}

export interface ErrorCapturedEvent {
  eventName: 'ErrorCaptured';
  errorId: string;
  message: string;
  severity: ErrorSeverity;
  timestamp: Date;
}

export interface BudgetExceededEvent {
  eventName: 'BudgetExceeded';
  metricType: MetricType;
  actualValue: number;
  thresholdValue: number;
  timestamp: Date;
}

export interface TelemetryFlushedEvent {
  eventName: 'TelemetryFlushed';
  batchId: string;
  metricsCount: number;
  errorsCount: number;
  timestamp: Date;
}

export type ObservabilityDomainEvent =
  | MetricRecordedEvent
  | TraceStartedEvent
  | TraceEndedEvent
  | ErrorCapturedEvent
  | BudgetExceededEvent
  | TelemetryFlushedEvent;
