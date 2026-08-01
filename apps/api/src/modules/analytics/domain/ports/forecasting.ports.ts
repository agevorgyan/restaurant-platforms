/**
 * Enterprise Forecasting & Predictive Analytics Platform - Domain Ports (Interfaces)
 *
 * Hexagonal architecture ports for persistence, prediction logging, read projections,
 * and pluggable forecasting engines.
 */

import { ForecastAggregate } from '../models/forecast.aggregate';
import { ForecastStatus, ForecastType } from '../enums/forecasting.enums';
import { ForecastModel, ForecastWindow, PredictionResult } from '../value-objects/forecasting-vo';
import {
  AnomalyHistoryReadModel,
  ConfidenceMetricsReadModel,
  ForecastCatalogReadModel,
  ForecastHistoryReadModel,
  PredictionHistoryReadModel,
  TrendStatisticsReadModel,
} from '../../application/read-models/forecasting.read-models';

export const FORECAST_REPOSITORY_TOKEN = Symbol('IForecastRepository');
export const FORECAST_QUERY_REPOSITORY_TOKEN = Symbol('IForecastQueryRepository');
export const FORECASTING_ENGINE_TOKEN = Symbol('IForecastingEnginePort');

export interface IForecastRepository {
  save(forecast: ForecastAggregate): Promise<void>;
  findById(id: string, tenantId?: string): Promise<ForecastAggregate | null>;
  findByTenant(
    tenantId: string,
    type?: ForecastType,
    status?: ForecastStatus
  ): Promise<ForecastAggregate[]>;
  delete(id: string, tenantId: string): Promise<boolean>;
}

export interface IForecastQueryRepository {
  getCatalog(
    tenantId?: string,
    type?: ForecastType,
    status?: ForecastStatus
  ): Promise<ForecastCatalogReadModel>;

  getForecastHistory(tenantId?: string, forecastId?: string): Promise<ForecastHistoryReadModel>;

  getPredictionHistory(tenantId?: string, forecastId?: string, limit?: number): Promise<PredictionHistoryReadModel>;

  getTrendStatistics(tenantId?: string, forecastId?: string): Promise<TrendStatisticsReadModel>;

  getAnomalyHistory(tenantId?: string, forecastId?: string): Promise<AnomalyHistoryReadModel>;

  getConfidenceMetrics(tenantId?: string): Promise<ConfidenceMetricsReadModel>;

  savePrediction(
    tenantId: string,
    forecastId: string,
    prediction: PredictionResult
  ): Promise<PredictionResult>;
}

export interface HistoricalDataPoint {
  timestamp: Date;
  value: number;
}

export interface IForecastingEnginePort {
  generatePredictions(
    model: ForecastModel,
    window: ForecastWindow,
    historicalPoints: HistoricalDataPoint[]
  ): Promise<PredictionResult[]>;
}
