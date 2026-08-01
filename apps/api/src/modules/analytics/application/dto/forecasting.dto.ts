/**
 * Enterprise Forecasting & Predictive Analytics Platform - Data Transfer Objects (DTOs)
 *
 * Command and Query request/response DTOs for REST presentation layer validation.
 */

import { ForecastType, ModelType } from '../../domain/enums/forecasting.enums';

export interface ForecastModelDto {
  modelType: ModelType;
  hyperparameters?: Record<string, unknown>;
  smoothingFactor?: number;
  windowSize?: number;
  isAiEnabled?: boolean;
}

export interface ForecastWindowDto {
  startDate: string;
  endDate: string;
  horizonPeriods?: number;
  timeUnit?: 'DAY' | 'WEEK' | 'MONTH';
}

export interface CreateForecastDto {
  name: string;
  forecastType: ForecastType;
  metricKey: string;
  model?: ForecastModelDto;
  window?: ForecastWindowDto;
  granularity?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';
  description?: string;
  tags?: string[];
}

export interface UpdateForecastDto {
  name?: string;
  model?: ForecastModelDto;
  window?: ForecastWindowDto;
  description?: string;
  tags?: string[];
  status?: 'DRAFT' | 'TRAINING' | 'READY' | 'PUBLISHED' | 'DEPRECATED' | 'ARCHIVED';
}

export interface HistoricalPointDto {
  timestamp: string;
  value: number;
}

export interface RecalculateForecastDto {
  historicalData?: HistoricalPointDto[];
  horizonPeriods?: number;
  modelTypeOverride?: ModelType;
}

export interface ExecuteBacktestDto {
  backtestWindowPeriods: number; // e.g. last 30 periods
  historicalData: HistoricalPointDto[];
}

export interface PredictionConfidenceDto {
  score: number;
  confidenceLevelPercentage: number;
  lowerBound: number;
  upperBound: number;
  mape: number;
}

export interface TrendDto {
  direction: 'UPWARD' | 'DOWNWARD' | 'FLAT';
  slope: number;
  acceleration: number;
  changePercentage: number;
}

export interface SeasonalityPatternDto {
  periodicity: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL';
  peakPeriods: string[];
  troughPeriods: string[];
  seasonalityIndex: number;
}

export interface AnomalyScoreDto {
  score: number;
  isAnomaly: boolean;
  deviationSigma: number;
  anomalyType?: 'SPIKE' | 'DIP' | 'PATTERN_SHIFT' | 'OUTLIER';
}

export interface PredictionResponseDto {
  predictionId: string;
  forecastId: string;
  tenantId: string;
  timestamp: string;
  predictedValue: number;
  confidence: PredictionConfidenceDto;
  trend: TrendDto;
  seasonality?: SeasonalityPatternDto;
  anomalyScore?: AnomalyScoreDto;
}

export interface ForecastResponseDto {
  id: string;
  tenantId: string;
  name: string;
  forecastType: ForecastType;
  metricKey: string;
  granularity: string;
  status: string;
  version: string;
  model: ForecastModelDto;
  window: ForecastWindowDto;
  description?: string;
  tags: string[];
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface BacktestResponseDto {
  forecastId: string;
  backtestPeriodsEvaluated: number;
  mape: number; // Mean Absolute Percentage Error e.g. 0.038 (3.8%)
  rmse: number; // Root Mean Squared Error
  mae: number;  // Mean Absolute Error
  accuracyPercentage: number; // e.g. 96.2%
  status: 'PASSED' | 'WARNING' | 'FAILED';
}
