/**
 * Enterprise Frontend Performance & Observability Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, Core Web Vitals Metric Collection, Distributed Tracing Header Injection,
 * React Error Boundary Logging, Performance Budget Compliance Evaluation, and CQRS Read Models.
 */

import { ErrorSeverity, MetricType } from '../src/domain/enums/observability.enums';
import {
  ErrorLogEntry,
  MetricThreshold,
  PerformanceBudget,
  PerformanceMetric,
  TraceContext,
} from '../src/domain/value-objects/observability-vo';
import {
  EnterpriseObservabilityPlatformService,
  ErrorReportingService,
  PerformanceBudgetService,
  PerformanceTelemetryService,
  RumCollectorService,
  TracingService,
} from '../src/services/observability.services';

describe('Enterprise Frontend Performance & Observability Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should generate trace and span IDs and format trace headers', () => {
      const trace = TraceContext.create();
      expect(trace.traceId).toMatch(/^tr-/);
      expect(trace.spanId).toMatch(/^sp-/);

      const headers = trace.toTraceHeaders();
      expect(headers['x-trace-id']).toBe(trace.traceId);
      expect(headers['x-span-id']).toBe(trace.spanId);
    });

    it('should evaluate metric rating threshold correctly', () => {
      const threshold = MetricThreshold.create(2500, 4000);
      expect(threshold.evaluateRating(1200)).toBe('good');
      expect(threshold.evaluateRating(3200)).toBe('needs-improvement');
      expect(threshold.evaluateRating(5000)).toBe('poor');
    });

    it('should detect performance budget violations', () => {
      const budget = PerformanceBudget.create(MetricType.LCP, 2500);
      expect(budget.isExceeded(2000)).toBe(false);
      expect(budget.isExceeded(2800)).toBe(true);
    });
  });

  describe('PerformanceTelemetryService & Web Vitals', () => {
    let telemetryService: PerformanceTelemetryService;

    beforeEach(() => {
      telemetryService = new PerformanceTelemetryService();
    });

    it('should record Web Vitals metrics and calculate overall health score', () => {
      telemetryService.recordMetric(MetricType.LCP, 1800);
      telemetryService.recordMetric(MetricType.CLS, 0.05);
      telemetryService.recordMetric(MetricType.FCP, 1200);

      const overview = telemetryService.getWebVitalsOverview();
      expect(overview.totalMetricsRecorded).toBe(3);
      expect(overview.overallHealthScore).toBe(100);
    });
  });

  describe('TracingService & Distributed Traces', () => {
    let tracingService: TracingService;

    beforeEach(() => {
      tracingService = new TracingService();
    });

    it('should start and end traces measuring span duration', () => {
      const trace = tracingService.startTrace('FETCH_MENU_CATALOG');
      expect(trace.traceId).toBeDefined();

      const durationMs = tracingService.endTrace(trace.spanId);
      expect(durationMs).toBeGreaterThanOrEqual(0);

      const activeTraces = tracingService.getActiveTraces();
      expect(activeTraces.totalActiveTracesCount).toBe(1);
    });
  });

  describe('ErrorReportingService & Error Boundaries', () => {
    let errorService: ErrorReportingService;

    beforeEach(() => {
      errorService = new ErrorReportingService();
    });

    it('should capture error boundary exceptions and group by severity', () => {
      errorService.captureError('TypeError: Cannot read property of null', 'ErrorStack...', 'POSHeader', ErrorSeverity.ERROR);
      errorService.captureError('Database connectivity warning', undefined, 'KDSQueue', ErrorSeverity.WARNING);

      const report = errorService.getErrorReport();
      expect(report.totalErrorsCount).toBe(2);
      expect(report.bySeverity[ErrorSeverity.ERROR]).toBe(1);
      expect(report.bySeverity[ErrorSeverity.WARNING]).toBe(1);
    });
  });

  describe('PerformanceBudgetService & Compliance', () => {
    let budgetService: PerformanceBudgetService;

    beforeEach(() => {
      budgetService = new PerformanceBudgetService();
    });

    it('should evaluate performance budget thresholds and track compliance', () => {
      budgetService.updateMetricValue(MetricType.LCP, 1800);
      budgetService.updateMetricValue(MetricType.CLS, 0.05);

      const compliance = budgetService.getBudgetCompliance();
      expect(compliance.totalBudgetsMonitored).toBe(3);
      expect(compliance.compliantBudgetsCount).toBe(3);
      expect(compliance.violatedBudgetsCount).toBe(0);
    });
  });

  describe('EnterpriseObservabilityPlatformService & Read Models', () => {
    let telemetryService: PerformanceTelemetryService;
    let tracingService: TracingService;
    let errorReportingService: ErrorReportingService;
    let rumService: RumCollectorService;
    let budgetService: PerformanceBudgetService;
    let platformService: EnterpriseObservabilityPlatformService;

    beforeEach(() => {
      telemetryService = new PerformanceTelemetryService();
      tracingService = new TracingService();
      errorReportingService = new ErrorReportingService();
      rumService = new RumCollectorService();
      budgetService = new PerformanceBudgetService();

      platformService = new EnterpriseObservabilityPlatformService(
        telemetryService,
        tracingService,
        errorReportingService,
        rumService,
        budgetService
      );
    });

    it('should query Real User Monitoring (RUM) session read models', () => {
      const rum = rumService.getRumSession('session-rum-100');
      expect(rum.sessionId).toBe('session-rum-100');
      expect(rum.pageViewsCount).toBe(14);
    });
  });
});
