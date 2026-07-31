/**
 * Enterprise Analytics Foundation Platform - CQRS Read Models
 */

import { AnalyticsType, MetricType, AggregationStrategy } from '../../domain/enums/analytics.enums';

export interface MetricCatalogEntry {
  id: string;
  metricName: string;
  metricType: MetricType;
  analyticsType: AnalyticsType;
  unit: string;
  lastValue: number;
  collectedAt: Date;
}

export interface MetricCatalog {
  totalMetrics: number;
  metrics: MetricCatalogEntry[];
}

export interface KpiCatalogItem {
  kpiId: string;
  name: string;
  formula: string;
  targetValue: number;
  currentValue: number;
  isTargetMet: boolean;
}

export interface KpiCatalog {
  totalKpis: number;
  kpis: KpiCatalogItem[];
}

export interface TimeSeriesMetricsPoint {
  timestamp: Date;
  value: number;
}

export interface TimeSeriesMetrics {
  metricName: string;
  analyticsType: AnalyticsType;
  points: TimeSeriesMetricsPoint[];
}

export interface AggregationHistoryItem {
  metricName: string;
  strategy: AggregationStrategy;
  aggregatedValue: number;
  windowSize: string;
  timestamp: Date;
}

export interface AggregationHistory {
  totalAggregations: number;
  history: AggregationHistoryItem[];
}

export interface AnalyticsStatistics {
  totalMetricsCollected: number;
  byAnalyticsType: Record<AnalyticsType, number>;
  byMetricType: Record<MetricType, number>;
  avgQueryLatencyMs: number;
}

export interface DimensionCatalog {
  availableDimensions: string[];
  totalDimensionsCount: number;
}
