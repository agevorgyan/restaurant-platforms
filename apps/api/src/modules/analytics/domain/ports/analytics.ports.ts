/**
 * Enterprise Analytics Foundation Platform - Hexagonal Domain Ports
 */

import { MetricAggregate } from '../models/metric.aggregate';
import { MetricId, AnalyticsQuery } from '../value-objects/analytics-vo';
import { AnalyticsType, MetricStatus } from '../enums/analytics.enums';

export interface AnalyticsQueryResult {
  metricName: string;
  analyticsType: AnalyticsType;
  aggregatedValue: number;
  sampleCount: number;
  timeBucketStart: Date;
  timeBucketEnd: Date;
}

export interface AnalyticsRepositoryPort {
  saveMetric(metric: MetricAggregate): Promise<void>;
  findMetricById(id: MetricId): Promise<MetricAggregate | null>;
  findMetrics(tenantId?: string, filters?: { metricName?: string; analyticsType?: AnalyticsType; status?: MetricStatus }): Promise<MetricAggregate[]>;
  executeQuery(tenantId: string, query: AnalyticsQuery): Promise<AnalyticsQueryResult[]>;
}
