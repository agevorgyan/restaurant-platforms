/**
 * Enterprise Analytics Foundation Platform - Domain Events
 */

import { randomUUID } from 'crypto';
import { AnalyticsType, MetricType, AggregationStrategy } from '../enums/analytics.enums';

export interface BaseAnalyticsDomainEvent {
  eventId: string;
  eventName: string;
  aggregateId: string;
  tenantId: string;
  timestamp: Date;
}

export class MetricCollectedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'MetricCollected';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly metricName: string,
    public readonly metricType: MetricType,
    public readonly analyticsType: AnalyticsType,
    public readonly value: number,
    public readonly unit: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class MetricAggregatedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'MetricAggregated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly metricName: string,
    public readonly strategy: AggregationStrategy,
    public readonly aggregatedValue: number,
    public readonly windowSize: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class KpiCalculatedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'KpiCalculated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly kpiName: string,
    public readonly calculatedValue: number,
    public readonly targetValue: number,
    public readonly isTargetMet: boolean,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class AnalyticsPublishedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'AnalyticsPublished';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly analyticsType: AnalyticsType,
    public readonly metricsCount: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class AggregationCompletedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'AggregationCompleted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly windowSize: string,
    public readonly metricsAggregatedCount: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class QueryExecutedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'QueryExecuted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly analyticsType: AnalyticsType,
    public readonly resultsCount: number,
    public readonly executionTimeMs: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export type AnalyticsDomainEvent =
  | MetricCollectedEvent
  | MetricAggregatedEvent
  | KpiCalculatedEvent
  | AnalyticsPublishedEvent
  | AggregationCompletedEvent
  | QueryExecutedEvent;
