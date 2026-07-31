/**
 * Enterprise Analytics Foundation Platform - REST Controller
 *
 * Exposes production REST API endpoints for metrics collection, OLAP multi-dimensional querying,
 * KPI target definitions, and time-series statistics.
 *
 * API Base Path: /analytics
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EnterpriseAnalyticsFoundationService } from '../../application/services/analytics-foundation.services';
import { CollectMetricDto, ExecuteAnalyticsQueryDto, AnalyticsMetricResponseDto, AnalyticsQueryResultDto } from '../../application/dto/analytics.dto';
import {
  MetricCatalog,
  KpiCatalog,
  AnalyticsStatistics,
} from '../../application/read-models/analytics.read-models';

@Controller('analytics')
export class EnterpriseAnalyticsController {
  constructor(private readonly analyticsService: EnterpriseAnalyticsFoundationService) {}

  /**
   * GET /analytics/metrics
   * Query catalog of collected metrics.
   */
  @Get('metrics')
  async getMetrics(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<MetricCatalog> {
    const tenantId = tenantHeader || undefined;
    return this.analyticsService.getMetricCatalog(tenantId);
  }

  /**
   * POST /analytics/metrics
   * Ingest an append-only raw time-series metric entry.
   */
  @Post('metrics')
  @HttpCode(HttpStatus.CREATED)
  async collectMetric(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: CollectMetricDto
  ): Promise<AnalyticsMetricResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.analyticsService.collectMetric(tenantId, dto);
  }

  /**
   * GET /analytics/kpis
   * Query calculated KPI targets catalog.
   */
  @Get('kpis')
  async getKpis(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<KpiCatalog> {
    const tenantId = tenantHeader || undefined;
    return this.analyticsService.getKpiCatalog(tenantId);
  }

  /**
   * GET /analytics/query
   * Execute OLAP analytics query using query parameters.
   */
  @Get('query')
  async queryMetricsGet(
    @Headers('x-tenant-id') tenantHeader: string,
    @Query('metricName') metricName: string
  ): Promise<AnalyticsQueryResultDto[]> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.analyticsService.executeAnalyticsQuery(tenantId, {
      metricNames: [metricName],
    });
  }

  /**
   * POST /analytics/query
   * Execute multi-dimensional OLAP time-series aggregation query.
   */
  @Post('query')
  @HttpCode(HttpStatus.OK)
  async queryMetricsPost(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: ExecuteAnalyticsQueryDto
  ): Promise<AnalyticsQueryResultDto[]> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.analyticsService.executeAnalyticsQuery(tenantId, dto);
  }

  /**
   * GET /analytics/statistics
   * Query overall analytics throughput and latency metrics.
   */
  @Get('statistics')
  async getStatistics(): Promise<AnalyticsStatistics> {
    return this.analyticsService.getAnalyticsStatistics();
  }
}
