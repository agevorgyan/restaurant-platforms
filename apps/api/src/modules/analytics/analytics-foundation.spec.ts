/**
 * Enterprise Analytics Foundation Platform - Comprehensive Test Suite
 *
 * Tests Append-Only Raw Metrics Ingestion, Multi-Dimensional OLAP Aggregation (Sum, Avg, Min, Max, Count),
 * TimeBucket Windowing, KPI Calculation Engine, Domain Events, and Analytics Querying.
 */

import { MetricName, MetricValue, TimeBucket, AnalyticsQuery } from './domain/value-objects/analytics-vo';
import { AnalyticsType, MetricType, MetricStatus, AggregationStrategy } from './domain/enums/analytics.enums';
import { InvalidMetricValueException } from './domain/exceptions/analytics.exceptions';
import { MetricAggregate } from './domain/models/metric.aggregate';
import { InMemoryAnalyticsRepository } from './infrastructure/repositories/in-memory-analytics.repository';
import { NestEventPublisherAdapter } from '../integration/infrastructure/adapters/connector.adapters';
import {
  MetricCollectionService,
  AggregationService,
  EnterpriseAnalyticsFoundationService,
} from './application/services/analytics-foundation.services';

describe('Enterprise Analytics Foundation Platform', () => {
  describe('Value Objects & Aggregation Rules', () => {
    it('should normalize MetricName and validate MetricValue', () => {
      const name = MetricName.create('POS.DAILY_SALES_USD');
      expect(name.getValue()).toBe('pos.daily_sales_usd');

      const val = MetricValue.create(150.5, 'USD');
      expect(val.amount).toBe(150.5);
      expect(val.unit).toBe('USD');

      expect(() => MetricValue.create(NaN)).toThrow(InvalidMetricValueException);
    });

    it('should throw InvalidMetricValueException if TimeBucket startTime is after endTime', () => {
      const start = new Date(Date.now());
      const end = new Date(Date.now() - 1000);
      expect(() => TimeBucket.create(start, end)).toThrow(InvalidMetricValueException);
    });

    it('should compute aggregations correctly across strategies', () => {
      const aggService = new AggregationService();
      const numbers = [10, 20, 30, 40, 50];

      expect(aggService.computeAggregation(numbers, AggregationStrategy.SUM)).toBe(150);
      expect(aggService.computeAggregation(numbers, AggregationStrategy.AVERAGE)).toBe(30);
      expect(aggService.computeAggregation(numbers, AggregationStrategy.MINIMUM)).toBe(10);
      expect(aggService.computeAggregation(numbers, AggregationStrategy.MAXIMUM)).toBe(50);
      expect(aggService.computeAggregation(numbers, AggregationStrategy.COUNT)).toBe(5);
    });
  });

  describe('MetricAggregate Root', () => {
    it('should collect append-only raw metric and transition to AGGREGATED', () => {
      const metric = MetricAggregate.collect({
        tenantId: 'store-101',
        metricName: 'orders_completed_count',
        metricType: MetricType.COUNTER,
        analyticsType: AnalyticsType.OPERATIONAL_ANALYTICS,
        value: 1,
        dimensions: { terminal_id: 'term-1' },
      });

      expect(metric.getStatus()).toBe(MetricStatus.COLLECTED);
      expect(metric.getMetricName().getValue()).toBe('orders_completed_count');
      expect(metric.getDimensions().length).toBe(1);

      metric.recordAggregation(AggregationStrategy.SUM, 1, '1h');
      expect(metric.getStatus()).toBe(MetricStatus.AGGREGATED);
      expect(metric.getAggregatedValue()).toBe(1);
    });
  });

  describe('Analytics Platform Services & OLAP Query Execution', () => {
    let repo: InMemoryAnalyticsRepository;
    let publisherAdapter: NestEventPublisherAdapter;
    let collectionService: MetricCollectionService;
    let aggregationService: AggregationService;
    let analyticsService: EnterpriseAnalyticsFoundationService;

    beforeEach(() => {
      repo = new InMemoryAnalyticsRepository();
      publisherAdapter = new NestEventPublisherAdapter();
      collectionService = new MetricCollectionService(repo);
      aggregationService = new AggregationService();

      analyticsService = new EnterpriseAnalyticsFoundationService(
        repo,
        publisherAdapter,
        collectionService,
        aggregationService
      );
    });

    it('should ingest append-only raw metrics, execute multi-dimensional OLAP query, and calculate KPIs', async () => {
      // 1. Ingest Raw Metrics
      await analyticsService.collectMetric('tenant-analytics-1', {
        metricName: 'sales_usd',
        metricType: MetricType.GAUGE,
        analyticsType: AnalyticsType.BUSINESS_ANALYTICS,
        value: 120.0,
        unit: 'USD',
        dimensions: { store_id: 'store-001' },
      });

      await analyticsService.collectMetric('tenant-analytics-1', {
        metricName: 'sales_usd',
        metricType: MetricType.GAUGE,
        analyticsType: AnalyticsType.BUSINESS_ANALYTICS,
        value: 180.0,
        unit: 'USD',
        dimensions: { store_id: 'store-001' },
      });

      // 2. Query Catalog
      const catalog = await analyticsService.getMetricCatalog('tenant-analytics-1');
      expect(catalog.totalMetrics).toBe(2);

      // 3. Execute Multi-Dimensional OLAP Aggregation Query
      const queryResults = await analyticsService.executeAnalyticsQuery('tenant-analytics-1', {
        analyticsType: AnalyticsType.BUSINESS_ANALYTICS,
        metricNames: ['sales_usd'],
        dimensionsFilter: { store_id: 'store-001' },
        strategy: AggregationStrategy.SUM,
        startTime: new Date(Date.now() - 60000),
        endTime: new Date(Date.now() + 60000),
      });

      expect(queryResults.length).toBe(1);
      expect(queryResults[0].metricName).toBe('sales_usd');
      expect(queryResults[0].aggregatedValue).toBe(300.0); // 120 + 180
      expect(queryResults[0].sampleCount).toBe(2);

      // 4. Query KPI Catalog & Statistics
      const kpiCatalog = await analyticsService.getKpiCatalog('tenant-analytics-1');
      expect(kpiCatalog.kpis.length).toBeGreaterThan(0);

      const stats = await analyticsService.getAnalyticsStatistics();
      expect(stats.totalMetricsCollected).toBe(2);
    });
  });
});
