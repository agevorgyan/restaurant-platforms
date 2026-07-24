import { 
  BenchmarkComparison, 
  BenchmarkDistribution, 
  BenchmarkRanking, 
  BenchmarkSnapshot, 
  BenchmarkTrend 
} from '../read-models';

export class PercentileCalculationService {
  public calculatePercentiles(scores: number[]): { p25: number, p50: number, p75: number } {
    if (scores.length === 0) return { p25: 0, p50: 0, p75: 0 };
    
    const sorted = [...scores].sort((a, b) => a - b);
    
    const getPercentile = (p: number) => {
      const index = (p / 100) * (sorted.length - 1);
      if (Number.isInteger(index)) return sorted[index];
      const lower = Math.floor(index);
      const upper = Math.ceil(index);
      const fraction = index - lower;
      return sorted[lower] + (sorted[upper] - sorted[lower]) * fraction;
    };

    return {
      p25: getPercentile(25),
      p50: getPercentile(50),
      p75: getPercentile(75)
    };
  }

  public getRank(score: number, sortedPopulation: number[]): number {
    if (sortedPopulation.length === 0) return 100;
    const below = sortedPopulation.filter(s => s < score).length;
    return (below / sortedPopulation.length) * 100;
  }
}

export class OutlierDetectionService {
  public detectOutliers(scores: number[]): { outliers: number[], mean: number, stdDev: number } {
    if (scores.length === 0) return { outliers: [], mean: 0, stdDev: 0 };
    
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);

    // Standard deviation method (z-score > 2)
    const outliers = scores.filter(s => Math.abs(s - mean) > 2 * stdDev);
    
    return { outliers, mean, stdDev };
  }
}

export class RankingService {
  public generateRanking(metric: string, period: string, entityScores: { targetId: string, score: number }[]): BenchmarkRanking {
    const sorted = [...entityScores].sort((a, b) => b.score - a.score); // DESC
    
    const medianScore = sorted.length > 0 ? sorted[Math.floor(sorted.length / 2)].score : 0;
    
    return {
      benchmarkId: crypto.randomUUID(),
      metric,
      period,
      topPerformers: sorted.slice(0, 3), // Top 3
      bottomPerformers: sorted.slice(-3).reverse(), // Bottom 3
      medianScore
    };
  }
}

export class ComparisonService {
  constructor(private readonly percentileService: PercentileCalculationService) {}

  public generateComparison(
    targetId: string, 
    targetScore: number, 
    metric: string, 
    populationScores: number[]
  ): BenchmarkComparison {
    const percentiles = this.percentileService.calculatePercentiles(populationScores);
    const mean = populationScores.reduce((a, b) => a + b, 0) / (populationScores.length || 1);
    
    return {
      metric,
      period: 'MONTHLY', // Default for mock
      targetId,
      targetScore,
      comparisonScope: 'INTERNAL',
      comparisonMean: mean,
      comparisonMedian: percentiles.p50,
      quartiles: {
        q1: percentiles.p25,
        q2: percentiles.p50,
        q3: percentiles.p75
      },
      variance: targetScore - mean
    };
  }
}

export class BenchmarkEngine {
  constructor(
    private readonly rankingService: RankingService,
    private readonly comparisonService: ComparisonService,
    private readonly outlierService: OutlierDetectionService
  ) {}

  public async evaluateBenchmark(targetId: string, metric: string, score: number, scope: string): Promise<BenchmarkSnapshot> {
    // Mock population fetch
    const mockPopulation = [85, 90, 78, 92, 88, 75, 95, 80, 82, 89];
    
    const comparison = this.comparisonService.generateComparison(targetId, score, metric, mockPopulation);
    
    // Calculate simple percentile rank
    const sorted = [...mockPopulation].sort((a, b) => a - b);
    const below = sorted.filter(s => s < score).length;
    const rank = mockPopulation.length > 0 ? (below / mockPopulation.length) * 100 : 100;

    return {
      benchmarkId: crypto.randomUUID(),
      metric,
      scope,
      period: 'MONTHLY',
      generatedAt: new Date(),
      targetId,
      score,
      percentileRank: rank,
      deviationFromMean: comparison.variance
    };
  }
}
