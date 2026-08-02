/**
 * Enterprise Restaurant Operations Analytics Platform - Analytics Bridge Port Interface
 *
 * Hexagonal Architecture Port interface for consuming core analytics platform infrastructure.
 */

import { MetricSnapshot } from '../value-objects/ops-analytics-vo';

export interface AnalyticsIngestionRequest {
  metricName: string;
  value: number;
  tags: Record<string, string>;
}

export interface AnalyticsBridgePort {
  ingestMetricSnapshot(snapshot: MetricSnapshot): Promise<boolean>;
  queryTimeSeries(metricName: string, window: string): Promise<Array<{ timestamp: string; value: number }>>;
}
