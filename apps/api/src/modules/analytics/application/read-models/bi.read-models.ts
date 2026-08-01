/**
 * Enterprise Business Intelligence Platform - Read Models
 *
 * Defines projection read models for self-service analytics, dimension catalogs,
 * measure catalogs, analytical query history, and query performance metrics.
 */

import { AnalysisType, DimensionType, MeasureType, CubeStatus, AggregationLevel } from '../../domain/enums/bi.enums';

export interface BusinessCubeSummary {
  cubeId: string;
  tenantId: string;
  name: string;
  analysisType: AnalysisType;
  status: CubeStatus;
  granularity: AggregationLevel;
  dimensionTypes: DimensionType[];
  measureTypes: MeasureType[];
  recordCount: number;
  lastRefreshedAt?: Date;
}

export interface BusinessCubesReadModel {
  totalCubes: number;
  cubes: BusinessCubeSummary[];
}

export interface DimensionInfo {
  type: DimensionType;
  name: string;
  description: string;
  hierarchies: string[];
  sampleValues: string[];
}

export interface DimensionCatalogReadModel {
  totalDimensions: number;
  dimensions: DimensionInfo[];
}

export interface MeasureInfo {
  type: MeasureType;
  name: string;
  description: string;
  unit: string;
  defaultAggregation: string;
}

export interface MeasureCatalogReadModel {
  totalMeasures: number;
  measures: MeasureInfo[];
}

export interface AnalyticalHistoryEntry {
  queryId: string;
  tenantId: string;
  cubeId: string;
  analysisType: AnalysisType;
  drillMode?: string;
  latencyMs: number;
  resultCount: number;
  executedAt: Date;
}

export interface AnalyticalHistoryReadModel {
  tenantId: string;
  totalQueriesExecuted: number;
  history: AnalyticalHistoryEntry[];
}

export interface CubeStatisticsReadModel {
  totalCubes: number;
  readyCubes: number;
  totalRecordCount: number;
  avgRefreshDurationMs: number;
  cacheHitRatio: number;
}

export interface QueryPerformanceReadModel {
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  totalQueries: number;
  slowQueriesCount: number;
  cacheHitRatioPercentage: number;
}
