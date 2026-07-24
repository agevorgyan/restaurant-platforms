import { Controller, Get, Param, Query } from '@nestjs/common';
import { 
  BenchmarkComparison, 
  BenchmarkSnapshot, 
  BenchmarkRanking 
} from '../../application/read-models';
import { BenchmarkEngine, RankingService, ComparisonService, OutlierDetectionService } from '../../application/services';

@Controller('enterprise/benchmarks')
export class EnterpriseBenchmarkController {
  constructor(
    private readonly benchmarkEngine: BenchmarkEngine,
    private readonly rankingService: RankingService,
    private readonly comparisonService: ComparisonService,
    private readonly outlierService: OutlierDetectionService
  ) {}

  @Get()
  async getGlobalBenchmarks(
    @Query('targetId') targetId: string,
    @Query('scope') scope: string = 'INTERNAL'
  ): Promise<BenchmarkSnapshot[]> {
    const metrics = ['REVENUE', 'PROFIT', 'ORDERS'];
    return Promise.all(
      metrics.map(metric => this.benchmarkEngine.evaluateBenchmark(targetId || 'default-org', metric, 90, scope))
    );
  }

  @Get('rankings')
  async getRankings(
    @Query('metric') metric: string = 'REVENUE',
    @Query('period') period: string = 'MONTHLY'
  ): Promise<BenchmarkRanking> {
    // Mock population fetch for rankings
    const mockEntities = [
      { targetId: 'org1', score: 95 },
      { targetId: 'org2', score: 85 },
      { targetId: 'org3', score: 72 },
      { targetId: 'org4', score: 91 },
      { targetId: 'org5', score: 68 }
    ];
    return this.rankingService.generateRanking(metric, period, mockEntities);
  }

  @Get('comparison')
  async getComparison(
    @Query('targetId') targetId: string,
    @Query('metric') metric: string,
    @Query('score') score: string
  ): Promise<BenchmarkComparison> {
    const mockPopulation = [85, 90, 78, 92, 88, 75, 95, 80, 82, 89];
    return this.comparisonService.generateComparison(
      targetId || 'default-org', 
      Number(score) || 85, 
      metric || 'REVENUE', 
      mockPopulation
    );
  }

  @Get('outliers')
  async getOutliers(@Query('metric') metric: string): Promise<any> {
    const mockPopulation = [85, 90, 78, 92, 88, 75, 95, 80, 82, 89, 20, 150]; // 20 and 150 are outliers
    return this.outlierService.detectOutliers(mockPopulation);
  }

  @Get(':type')
  async getBenchmarkByType(
    @Param('type') type: string,
    @Query('targetId') targetId: string,
    @Query('score') score: string,
    @Query('scope') scope: string = 'INTERNAL'
  ): Promise<BenchmarkSnapshot> {
    return this.benchmarkEngine.evaluateBenchmark(
      targetId || 'default-org', 
      type.toUpperCase(), 
      Number(score) || 85, 
      scope
    );
  }
}
