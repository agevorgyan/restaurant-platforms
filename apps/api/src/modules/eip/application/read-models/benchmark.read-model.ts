export interface BenchmarkSnapshot {
  benchmarkId: string;
  metric: string;
  scope: string; // INTERNAL | INDUSTRY | GLOBAL
  period: string; // DAILY | WEEKLY | MONTHLY | QUARTERLY | YEARLY
  generatedAt: Date;
  targetId: string; // ID of the entity being benchmarked
  score: number;
  percentileRank: number;
  deviationFromMean: number;
}

export interface BenchmarkRanking {
  benchmarkId: string;
  metric: string;
  period: string;
  topPerformers: { targetId: string; score: number }[];
  bottomPerformers: { targetId: string; score: number }[];
  medianScore: number;
}

export interface BenchmarkTrend {
  benchmarkId: string;
  metric: string;
  targetId: string;
  historicalPercentiles: { timestamp: Date; percentile: number }[];
  trendDirection: 'IMPROVING' | 'DECLINING' | 'STABLE';
}

export interface BenchmarkComparison {
  metric: string;
  period: string;
  targetId: string;
  targetScore: number;
  comparisonScope: string;
  comparisonMean: number;
  comparisonMedian: number;
  quartiles: {
    q1: number;
    q2: number;
    q3: number;
  };
  variance: number;
}

export interface BenchmarkDistribution {
  benchmarkId: string;
  metric: string;
  period: string;
  buckets: {
    rangeStart: number;
    rangeEnd: number;
    frequency: number;
  }[];
  mean: number;
  standardDeviation: number;
}
