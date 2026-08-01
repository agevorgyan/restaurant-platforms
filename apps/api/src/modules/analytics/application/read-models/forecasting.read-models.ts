/**
 * Enterprise Forecasting & Predictive Analytics Platform - Read Models (CQRS Queries)
 *
 * Strongly-typed read projections optimized for forecast catalog listing, execution history,
 * immutable prediction audit trails, trend analytics, anomaly logs, and model accuracy metrics.
 */

import { ForecastStatus, ForecastType, ModelType, PredictionStatus } from '../../domain/enums/forecasting.enums';

export interface ForecastSummaryReadModel {
  id: string;
  tenantId: string;
  name: string;
  forecastType: ForecastType;
  modelType: ModelType;
  status: ForecastStatus;
  version: string;
  metricKey: string;
  granularity: string;
  horizonPeriods: number;
  tags: string[];
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ForecastCatalogReadModel {
  tenantId?: string;
  totalForecasts: number;
  forecasts: ForecastSummaryReadModel[];
}

export interface ForecastHistoryEntry {
  executionId: string;
  forecastId: string;
  tenantId: string;
  modelType: ModelType;
  predictionsGenerated: number;
  avgConfidenceScore: number;
  executionLatencyMs: number;
  executedAt: string;
}

export interface ForecastHistoryReadModel {
  tenantId?: string;
  totalExecutions: number;
  history: ForecastHistoryEntry[];
}

export interface PredictionItemReadModel {
  predictionId: string;
  forecastId: string;
  tenantId: string;
  timestamp: string;
  predictedValue: number;
  confidenceScore: number;
  lowerBound: number;
  upperBound: number;
  trendDirection: 'UPWARD' | 'DOWNWARD' | 'FLAT';
  status: PredictionStatus;
  createdAt: string;
}

export interface PredictionHistoryReadModel {
  tenantId?: string;
  totalPredictions: number;
  predictions: PredictionItemReadModel[];
}

export interface TrendSummaryItem {
  forecastId: string;
  forecastName: string;
  direction: 'UPWARD' | 'DOWNWARD' | 'FLAT';
  slope: number;
  acceleration: number;
  changePercentage: number;
  detectedAt: string;
}

export interface TrendStatisticsReadModel {
  tenantId?: string;
  totalTrendsTracked: number;
  upwardTrendsCount: number;
  downwardTrendsCount: number;
  flatTrendsCount: number;
  trends: TrendSummaryItem[];
}

export interface AnomalyItemReadModel {
  anomalyId: string;
  forecastId: string;
  tenantId: string;
  metricKey: string;
  anomalyScore: number;
  deviationSigma: number;
  anomalyType: 'SPIKE' | 'DIP' | 'PATTERN_SHIFT' | 'OUTLIER';
  detectedAt: string;
}

export interface AnomalyHistoryReadModel {
  tenantId?: string;
  totalAnomaliesDetected: number;
  spikeCount: number;
  dipCount: number;
  patternShiftCount: number;
  anomalies: AnomalyItemReadModel[];
}

export interface ConfidenceMetricsReadModel {
  tenantId?: string;
  averageModelConfidence: number; // e.g. 0.92 (92%)
  avgMape: number; // Mean Absolute Percentage Error e.g. 0.04 (4%)
  avgRmse: number; // Root Mean Square Error
  highConfidenceForecastsCount: number; // score >= 0.85
  modelPerformanceByType: Record<ModelType, { count: number; avgConfidence: number }>;
}
