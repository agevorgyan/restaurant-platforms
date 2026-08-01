/**
 * Enterprise Forecasting & Predictive Analytics Platform - REST Controller
 *
 * Exposes production REST API endpoints for forecast definitions, predictive model generation,
 * historical backtesting, trend analytics, anomaly logs, confidence metrics, and recalculations.
 *
 * API Base Path: /analytics
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EnterpriseForecastingPlatformService } from '../../application/services/forecasting-platform.services';
import {
  BacktestResponseDto,
  CreateForecastDto,
  ExecuteBacktestDto,
  ForecastResponseDto,
  PredictionResponseDto,
  RecalculateForecastDto,
  UpdateForecastDto,
} from '../../application/dto/forecasting.dto';
import {
  AnomalyHistoryReadModel,
  ConfidenceMetricsReadModel,
  ForecastCatalogReadModel,
  ForecastHistoryReadModel,
  PredictionHistoryReadModel,
  TrendStatisticsReadModel,
} from '../../application/read-models/forecasting.read-models';
import { ForecastStatus, ForecastType } from '../../domain/enums/forecasting.enums';

@Controller('analytics')
export class EnterpriseForecastingController {
  constructor(private readonly forecastingService: EnterpriseForecastingPlatformService) {}

  /**
   * GET /analytics/forecasts
   * Query catalog of forecast definitions for tenant. Filterable by type and status.
   */
  @Get('forecasts')
  async getForecasts(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('type') type?: ForecastType,
    @Query('status') status?: ForecastStatus
  ): Promise<ForecastCatalogReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.forecastingService.getForecasts(tenantId, type, status);
  }

  /**
   * GET /analytics/forecasts/history
   * Query forecast model execution history log.
   */
  @Get('forecasts/history')
  async getForecastHistory(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('forecastId') forecastId?: string
  ): Promise<ForecastHistoryReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.forecastingService.getForecastHistory(tenantId, forecastId);
  }

  /**
   * GET /analytics/forecasts/confidence
   * Query forecast confidence metrics, MAPE, RMSE, and model performance breakdown.
   */
  @Get('forecasts/confidence')
  async getConfidenceMetrics(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<ConfidenceMetricsReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.forecastingService.getConfidenceMetrics(tenantId);
  }

  /**
   * GET /analytics/forecasts/:id
   * Retrieve single forecast definition by ID.
   */
  @Get('forecasts/:id')
  async getForecastById(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<ForecastResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.forecastingService.getForecastById(tenantId, id);
  }

  /**
   * POST /analytics/forecasts
   * Register a new forecasting model definition.
   */
  @Post('forecasts')
  @HttpCode(HttpStatus.CREATED)
  async createForecast(
    @Headers('x-tenant-id') tenantHeader: string,
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: CreateForecastDto
  ): Promise<ForecastResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    const createdBy = userIdHeader || 'system';
    return this.forecastingService.createForecast(tenantId, dto, createdBy);
  }

  /**
   * PATCH /analytics/forecasts/:id
   * Update forecast definition, model hyperparameters, window, or lifecycle status.
   */
  @Patch('forecasts/:id')
  async updateForecast(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader: string,
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: UpdateForecastDto
  ): Promise<ForecastResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    const updatedBy = userIdHeader || 'system';
    return this.forecastingService.updateForecast(tenantId, id, dto, updatedBy);
  }

  /**
   * POST /analytics/forecasts/recalculate (or POST /analytics/forecasts/:id/recalculate)
   * Trigger forecast recalculation and generate immutable prediction results.
   */
  @Post('forecasts/recalculate')
  @HttpCode(HttpStatus.OK)
  async recalculateForecastQuery(
    @Headers('x-tenant-id') tenantHeader: string,
    @Query('forecastId') queryForecastId: string,
    @Body() dto?: RecalculateForecastDto
  ): Promise<PredictionResponseDto[]> {
    const tenantId = tenantHeader || 'tenant-default';
    const forecastId = queryForecastId || 'fcst-tpl-1';
    return this.forecastingService.recalculateForecast(tenantId, forecastId, dto);
  }

  /**
   * POST /analytics/forecasts/:id/recalculate
   * Path variant to recalculate a specific forecast model by URL param.
   */
  @Post('forecasts/:id/recalculate')
  @HttpCode(HttpStatus.OK)
  async recalculateForecastPath(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto?: RecalculateForecastDto
  ): Promise<PredictionResponseDto[]> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.forecastingService.recalculateForecast(tenantId, id, dto);
  }

  /**
   * POST /analytics/forecasts/:id/backtest
   * Execute historical backtesting without mutating underlying historical datasets.
   */
  @Post('forecasts/:id/backtest')
  @HttpCode(HttpStatus.OK)
  async executeBacktest(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: ExecuteBacktestDto
  ): Promise<BacktestResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.forecastingService.executeBacktest(tenantId, id, dto);
  }

  /**
   * GET /analytics/predictions
   * Query immutable prediction history records.
   */
  @Get('predictions')
  async getPredictions(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('forecastId') forecastId?: string,
    @Query('limit') limit?: number
  ): Promise<PredictionHistoryReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    const limitNum = limit ? Number(limit) : 50;
    return this.forecastingService.getPredictionHistory(tenantId, forecastId, limitNum);
  }

  /**
   * GET /analytics/trends
   * Query trend statistics and direction metrics.
   */
  @Get('trends')
  async getTrends(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('forecastId') forecastId?: string
  ): Promise<TrendStatisticsReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.forecastingService.getTrendStatistics(tenantId, forecastId);
  }

  /**
   * GET /analytics/anomalies
   * Query detected anomalies and outlier logs.
   */
  @Get('anomalies')
  async getAnomalies(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('forecastId') forecastId?: string
  ): Promise<AnomalyHistoryReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.forecastingService.getAnomalyHistory(tenantId, forecastId);
  }
}
