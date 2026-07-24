export interface SearchAnalyticsDashboard {
  tenantId: string;
  totalSearches: number;
  uniqueUsers: number;
  averageClickThroughRate: number;
  zeroResultRate: number;
  abandonmentRate: number;
  topQueries: string[];
}

export interface SlowQueryReport {
  tenantId: string;
  reportDate: Date;
  queries: Array<{
    query: string;
    averageLatencyMs: number;
    p99LatencyMs: number;
    volume: number;
  }>;
}

export interface SearchTrendReport {
  tenantId: string;
  timeframe: string;
  risingQueries: Array<{ query: string; growthPercent: number }>;
  fallingQueries: Array<{ query: string; dropPercent: number }>;
  seasonalQueries: Array<{ query: string; peakSeason: string }>;
}

export interface OptimizationReport {
  tenantId: string;
  lastRun: Date;
  optimizationsApplied: number;
  estimatedPerformanceGainPercent: number;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
}

export interface RecommendationReport {
  tenantId: string;
  totalRecommendations: number;
  criticalSuggestions: number;
  suggestions: Array<{
    id: string;
    type: string;
    description: string;
    impactScore: number;
  }>;
}
