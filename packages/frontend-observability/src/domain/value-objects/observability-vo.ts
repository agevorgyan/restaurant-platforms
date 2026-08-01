/**
 * Enterprise Frontend Performance & Observability Platform - Value Objects
 *
 * Immutable Value Objects encapsulating trace context, performance metrics, metric thresholds,
 * error log entries, telemetry batches, and performance budgets.
 */

import { ErrorSeverity, MetricType } from '../enums/observability.enums';

/**
 * TraceContext Value Object
 */
export class TraceContext {
  public readonly traceId: string;
  public readonly spanId: string;
  public readonly parentSpanId?: string;

  private constructor(traceId: string, spanId: string, parentSpanId?: string) {
    this.traceId = traceId;
    this.spanId = spanId;
    this.parentSpanId = parentSpanId;
  }

  public static create(traceId?: string, spanId?: string, parentSpanId?: string): TraceContext {
    const tid = traceId || `tr-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const sid = spanId || `sp-${Math.random().toString(36).substring(2, 8)}`;
    return new TraceContext(tid, sid, parentSpanId);
  }

  public toTraceHeaders(): Record<string, string> {
    return {
      'x-trace-id': this.traceId,
      'x-span-id': this.spanId,
      ...(this.parentSpanId ? { 'x-parent-span-id': this.parentSpanId } : {}),
    };
  }
}

/**
 * MetricThreshold Value Object
 */
export class MetricThreshold {
  public readonly goodMax: number;
  public readonly needsImprovementMax: number;

  private constructor(goodMax: number, needsImprovementMax: number) {
    this.goodMax = goodMax;
    this.needsImprovementMax = needsImprovementMax;
  }

  public static create(goodMax: number, needsImprovementMax: number): MetricThreshold {
    return new MetricThreshold(goodMax, needsImprovementMax);
  }

  public evaluateRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= this.goodMax) return 'good';
    if (value <= this.needsImprovementMax) return 'needs-improvement';
    return 'poor';
  }
}

/**
 * PerformanceMetric Value Object
 */
export class PerformanceMetric {
  public readonly metricType: MetricType;
  public readonly value: number;
  public readonly rating: 'good' | 'needs-improvement' | 'poor';
  public readonly timestamp: Date;

  private constructor(metricType: MetricType, value: number, threshold: MetricThreshold) {
    this.metricType = metricType;
    this.value = value;
    this.rating = threshold.evaluateRating(value);
    this.timestamp = new Date();
  }

  public static create(metricType: MetricType, value: number, threshold: MetricThreshold): PerformanceMetric {
    return new PerformanceMetric(metricType, value, threshold);
  }
}

/**
 * ErrorLogEntry Value Object
 */
export class ErrorLogEntry {
  public readonly errorId: string;
  public readonly message: string;
  public readonly stackTrace?: string;
  public readonly severity: ErrorSeverity;
  public readonly componentName?: string;
  public readonly timestamp: Date;

  private constructor(errorId: string, message: string, stackTrace?: string, severity: ErrorSeverity = ErrorSeverity.ERROR, componentName?: string) {
    this.errorId = errorId;
    this.message = message;
    this.stackTrace = stackTrace;
    this.severity = severity;
    this.componentName = componentName;
    this.timestamp = new Date();
  }

  public static create(props: {
    message: string;
    stackTrace?: string;
    severity?: ErrorSeverity;
    componentName?: string;
    errorId?: string;
  }): ErrorLogEntry {
    return new ErrorLogEntry(
      props.errorId || `err-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      props.message,
      props.stackTrace,
      props.severity || ErrorSeverity.ERROR,
      props.componentName
    );
  }
}

/**
 * PerformanceBudget Value Object
 */
export class PerformanceBudget {
  public readonly budgetId: string;
  public readonly targetMetric: MetricType;
  public readonly maxThresholdValue: number;

  private constructor(budgetId: string, targetMetric: MetricType, maxThresholdValue: number) {
    this.budgetId = budgetId;
    this.targetMetric = targetMetric;
    this.maxThresholdValue = maxThresholdValue;
  }

  public static create(targetMetric: MetricType, maxThresholdValue: number, budgetId?: string): PerformanceBudget {
    return new PerformanceBudget(budgetId || `budget-${targetMetric.toLowerCase()}`, targetMetric, maxThresholdValue);
  }

  public isExceeded(actualValue: number): boolean {
    return actualValue > this.maxThresholdValue;
  }
}

/**
 * TelemetryBatch Value Object
 */
export class TelemetryBatch {
  public readonly batchId: string;
  public readonly metrics: PerformanceMetric[];
  public readonly errors: ErrorLogEntry[];
  public readonly createdAt: Date;

  private constructor(batchId: string, metrics: PerformanceMetric[], errors: ErrorLogEntry[]) {
    this.batchId = batchId;
    this.metrics = metrics;
    this.errors = errors;
    this.createdAt = new Date();
  }

  public static create(metrics: PerformanceMetric[], errors: ErrorLogEntry[]): TelemetryBatch {
    return new TelemetryBatch(`telem-batch-${Date.now()}`, metrics, errors);
  }
}
