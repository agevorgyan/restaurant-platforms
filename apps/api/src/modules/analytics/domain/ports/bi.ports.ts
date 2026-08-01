/**
 * Enterprise Business Intelligence Platform - Hexagonal Ports
 *
 * Defines repository and pluggable OLAP Engine contracts.
 */

import { CubeAggregate } from '../models/cube.aggregate';
import { AnalyticalQuery, SemanticModel, DrillPath, FilterSet } from '../value-objects/bi-vo';
import { AnalysisType, CubeStatus } from '../enums/bi.enums';

export interface BiQueryResultRow {
  dimensions: Record<string, string>;
  measures: Record<string, number>;
  aggregationLevel?: string;
}

export interface BiQueryResult {
  cubeId: string;
  analysisType: AnalysisType;
  selectedDimensions: string[];
  selectedMeasures: string[];
  rows: BiQueryResultRow[];
  totalRecords: number;
  executionLatencyMs: number;
  cacheHit: boolean;
}

export interface BiRepositoryPort {
  saveCube(cube: CubeAggregate): Promise<void>;
  findCubeById(id: string): Promise<CubeAggregate | null>;
  findCubes(tenantId?: string, analysisType?: AnalysisType, status?: CubeStatus): Promise<CubeAggregate[]>;

  saveSemanticModel(model: SemanticModel): Promise<void>;
  findSemanticModelById(modelId: string): Promise<SemanticModel | null>;
  listSemanticModels(analysisType?: AnalysisType): Promise<SemanticModel[]>;

  logQueryExecution(record: {
    tenantId: string;
    cubeId: string;
    analysisType: AnalysisType;
    latencyMs: number;
    resultCount: number;
    drillMode?: string;
    executedAt: Date;
  }): Promise<void>;

  getAnalyticalHistory(tenantId: string, limit?: number): Promise<any[]>;
  getCubeStatistics(tenantId?: string): Promise<{
    totalCubes: number;
    readyCubes: number;
    totalRecordCount: number;
    avgRefreshDurationMs: number;
    cacheHitRatio: number;
  }>;
}

export interface OlapEnginePort {
  executeAnalyticalQuery(tenantId: string, query: AnalyticalQuery): Promise<BiQueryResult>;
  executeDrillQuery(tenantId: string, cubeId: string, drillPath: DrillPath, filterSet?: FilterSet): Promise<BiQueryResult>;
  materializeAggregates(cube: CubeAggregate): Promise<number>;
}
