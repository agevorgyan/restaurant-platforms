export interface QueryExecutionStatistics {
  tenantId: string;
  totalQueries: number;
  averageParseMs: number;
  averageOptimizationMs: number;
  averageExecutionMs: number;
  totalLatencyMs: number;
  failedQueries: number;
}

export interface SlowQueries {
  tenantId: string;
  queries: Array<{
    queryId: string;
    rawQuery: string;
    totalLatencyMs: number;
    timestamp: Date;
    bottleneckStage: string;
  }>;
}

export interface ExecutionHistory {
  tenantId: string;
  queryId: string;
  rawQuery: string;
  strategy: string;
  totalHits: number;
  timestamp: Date;
  wasSuccessful: boolean;
  errorReason?: string;
}

export interface OptimizationStatistics {
  tenantId: string;
  totalOptimizations: number;
  averageCostReductionPercent: number;
  queriesBypassingOptimization: number;
}

export interface QueryHealth {
  tenantId: string;
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  errorRate: number;
  p99LatencyMs: number;
}
