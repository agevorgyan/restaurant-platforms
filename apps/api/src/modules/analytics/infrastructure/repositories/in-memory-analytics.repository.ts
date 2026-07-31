/**
 * Enterprise Analytics Foundation Platform - In-Memory Repository
 *
 * Implements Hexagonal AnalyticsRepositoryPort using append-only time-series store
 * and multi-dimensional OLAP aggregation querying.
 */

import { Injectable } from '@nestjs/common';
import { MetricAggregate } from '../../domain/models/metric.aggregate';
import { MetricId, AnalyticsQuery } from '../../domain/value-objects/analytics-vo';
import { AnalyticsType, MetricStatus, AggregationStrategy } from '../../domain/enums/analytics.enums';
import { AnalyticsRepositoryPort, AnalyticsQueryResult } from '../../domain/ports/analytics.ports';

@Injectable()
export class InMemoryAnalyticsRepository implements AnalyticsRepositoryPort {
  private readonly store: MetricAggregate[] = [];

  public async saveMetric(metric: MetricAggregate): Promise<void> {
    // Append-Only store
    this.store.push(metric);
  }

  public async findMetricById(id: MetricId): Promise<MetricAggregate | null> {
    const found = this.store.find(m => m.getId().getValue() === id.getValue());
    return found || null;
  }

  public async findMetrics(tenantId?: string, filters?: { metricName?: string; analyticsType?: AnalyticsType; status?: MetricStatus }): Promise<MetricAggregate[]> {
    let result = [...this.store];

    if (tenantId) {
      result = result.filter(m => m.getTenantId() === tenantId);
    }

    if (filters?.metricName) {
      result = result.filter(m => m.getMetricName().getValue() === filters.metricName.toLowerCase());
    }

    if (filters?.analyticsType) {
      result = result.filter(m => m.getAnalyticsType() === filters.analyticsType);
    }

    if (filters?.status) {
      result = result.filter(m => m.getStatus() === filters.status);
    }

    return result;
  }

  public async executeQuery(tenantId: string, query: AnalyticsQuery): Promise<AnalyticsQueryResult[]> {
    const results: AnalyticsQueryResult[] = [];

    for (const name of query.metricNames) {
      const filtered = this.store.filter(m => {
        if (m.getTenantId() !== tenantId) return false;
        if (m.getMetricName().getValue() !== name.toLowerCase()) return false;
        if (m.getCollectedAt() < query.timeBucket.startTime || m.getCollectedAt() > query.timeBucket.endTime) return false;

        // Check dimension filter matching
        for (const [dimKey, dimVal] of Object.entries(query.dimensionsFilter)) {
          const match = m.getDimensions().some(d => d.key === dimKey && d.value === dimVal);
          if (!match) return false;
        }

        return true;
      });

      const values = filtered.map(m => m.getMetricValue().amount);
      let aggregatedValue = 0;

      if (values.length > 0) {
        switch (query.strategy) {
          case AggregationStrategy.SUM:
            aggregatedValue = values.reduce((a, b) => a + b, 0);
            break;
          case AggregationStrategy.AVERAGE:
          case AggregationStrategy.MOVING_AVERAGE:
            aggregatedValue = values.reduce((a, b) => a + b, 0) / values.length;
            break;
          case AggregationStrategy.MINIMUM:
            aggregatedValue = Math.min(...values);
            break;
          case AggregationStrategy.MAXIMUM:
            aggregatedValue = Math.max(...values);
            break;
          case AggregationStrategy.COUNT:
            aggregatedValue = values.length;
            break;
          default:
            aggregatedValue = values.reduce((a, b) => a + b, 0);
        }
      }

      results.push({
        metricName: name,
        analyticsType: query.analyticsType,
        aggregatedValue,
        sampleCount: values.length,
        timeBucketStart: query.timeBucket.startTime,
        timeBucketEnd: query.timeBucket.endTime,
      });
    }

    return results;
  }

  public clear(): void {
    this.store.length = 0;
  }
}
