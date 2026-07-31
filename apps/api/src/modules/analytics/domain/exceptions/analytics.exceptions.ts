/**
 * Enterprise Analytics Foundation Platform - Domain Exceptions
 */

export class AnalyticsDomainException extends Error {
  constructor(message: string, public readonly code: string = 'ANALYTICS_DOMAIN_ERROR') {
    super(message);
    this.name = 'AnalyticsDomainException';
  }
}

export class InvalidMetricValueException extends AnalyticsDomainException {
  constructor(reason: string) {
    super(`Invalid metric value: ${reason}`, 'INVALID_METRIC_VALUE');
  }
}

export class QueryExecutionException extends AnalyticsDomainException {
  constructor(reason: string) {
    super(`Analytics query execution failed: ${reason}`, 'QUERY_EXECUTION_FAILED');
  }
}

export class MetricNotFoundException extends AnalyticsDomainException {
  constructor(id: string) {
    super(`Analytics Metric with ID '${id}' was not found`, 'METRIC_NOT_FOUND');
  }
}
