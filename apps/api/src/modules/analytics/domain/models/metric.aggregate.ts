/**
 * Enterprise Analytics Foundation Platform - Metric Aggregate Root
 *
 * Manages append-only raw time-series metric collection, multi-dimensional tag indexing,
 * and status transitions (COLLECTED -> AGGREGATED -> PUBLISHED).
 */

import { AnalyticsType, MetricType, MetricStatus, AggregationStrategy } from '../enums/analytics.enums';
import { MetricId, MetricName, MetricValue, Dimension } from '../value-objects/analytics-vo';
import { BaseAnalyticsDomainEvent, MetricCollectedEvent, MetricAggregatedEvent } from '../events/analytics.events';

export interface MetricAggregateProps {
  id: MetricId;
  tenantId: string;
  metricName: MetricName;
  metricType: MetricType;
  analyticsType: AnalyticsType;
  metricValue: MetricValue;
  dimensions: Dimension[];
  status: MetricStatus;
  collectedAt: Date;
  aggregatedValue?: number;
  aggregationStrategy?: AggregationStrategy;
}

export class MetricAggregate {
  private domainEvents: BaseAnalyticsDomainEvent[] = [];

  private constructor(private props: MetricAggregateProps) {}

  public static collect(params: {
    id?: MetricId;
    tenantId?: string;
    metricName: string;
    metricType?: MetricType;
    analyticsType?: AnalyticsType;
    value: number;
    unit?: string;
    dimensions?: Record<string, string>;
  }): MetricAggregate {
    const id = params.id || MetricId.generate();
    const tenantId = params.tenantId || 'tenant-default';
    const metricName = MetricName.create(params.metricName);
    const metricType = params.metricType || MetricType.GAUGE;
    const analyticsType = params.analyticsType || AnalyticsType.BUSINESS_ANALYTICS;
    const metricValue = MetricValue.create(params.value, params.unit || 'COUNT');

    const dimensionsList: Dimension[] = [];
    if (params.dimensions) {
      for (const [k, v] of Object.entries(params.dimensions)) {
        dimensionsList.push(Dimension.create(k, v));
      }
    }

    const now = new Date();
    const aggregate = new MetricAggregate({
      id,
      tenantId,
      metricName,
      metricType,
      analyticsType,
      metricValue,
      dimensions: dimensionsList,
      status: MetricStatus.COLLECTED,
      collectedAt: now,
    });

    aggregate.addDomainEvent(
      new MetricCollectedEvent(
        id.getValue(),
        tenantId,
        metricName.getValue(),
        metricType,
        analyticsType,
        metricValue.amount,
        metricValue.unit,
        now
      )
    );

    return aggregate;
  }

  // --- Getters ---
  public getId(): MetricId { return this.props.id; }
  public getTenantId(): string { return this.props.tenantId; }
  public getMetricName(): MetricName { return this.props.metricName; }
  public getMetricType(): MetricType { return this.props.metricType; }
  public getAnalyticsType(): AnalyticsType { return this.props.analyticsType; }
  public getMetricValue(): MetricValue { return this.props.metricValue; }
  public getDimensions(): Dimension[] { return [...this.props.dimensions]; }
  public getStatus(): MetricStatus { return this.props.status; }
  public getCollectedAt(): Date { return this.props.collectedAt; }
  public getAggregatedValue(): number | undefined { return this.props.aggregatedValue; }

  public getUncommittedEvents(): BaseAnalyticsDomainEvent[] { return [...this.domainEvents]; }
  public clearEvents(): void { this.domainEvents = []; }

  private addDomainEvent(event: BaseAnalyticsDomainEvent): void { this.domainEvents.push(event); }

  public recordAggregation(strategy: AggregationStrategy, aggregatedValue: number, windowSize: string): void {
    this.props.aggregatedValue = aggregatedValue;
    this.props.aggregationStrategy = strategy;
    this.props.status = MetricStatus.AGGREGATED;

    this.addDomainEvent(
      new MetricAggregatedEvent(
        this.getId().getValue(),
        this.getTenantId(),
        this.getMetricName().getValue(),
        strategy,
        aggregatedValue,
        windowSize,
        new Date()
      )
    );
  }
}
