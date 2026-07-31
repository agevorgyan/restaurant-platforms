/**
 * Enterprise Analytics Foundation Platform - Application DTOs
 */

import { AnalyticsType, MetricType, AggregationStrategy } from '../../domain/enums/analytics.enums';

export interface CollectMetricDto {
  metricName: string;
  metricType?: MetricType;
  analyticsType?: AnalyticsType;
  value: number;
  unit?: string;
  dimensions?: Record<string, string>;
}

export interface ExecuteAnalyticsQueryDto {
  analyticsType?: AnalyticsType;
  metricNames: string[];
  dimensionsFilter?: Record<string, string>;
  strategy?: AggregationStrategy;
  startTime?: Date;
  endTime?: Date;
}

export interface AnalyticsMetricResponseDto {
  id: string;
  tenantId: string;
  metricName: string;
  metricType: MetricType;
  analyticsType: AnalyticsType;
  value: number;
  unit: string;
  dimensions: Record<string, string>;
  status: string;
  collectedAt: Date;
}

export interface AnalyticsQueryResultDto {
  metricName: string;
  analyticsType: AnalyticsType;
  aggregatedValue: number;
  sampleCount: number;
  timeBucketStart: Date;
  timeBucketEnd: Date;
}
