import { Controller, Get, Post, Query, Headers } from '@nestjs/common';
import { 
  SearchAnalyticsDashboard,
  SearchTrendReport,
  SlowQueryReport,
  RecommendationReport,
  OptimizationReport
} from '../../application/read-models';
import { 
  OptimizationScheduler,
  TrendAnalysisService
} from '../../domain/services';

@Controller('search/analytics')
export class EnterpriseSearchAnalyticsController {
  constructor(
    private readonly optimizationScheduler: OptimizationScheduler,
    private readonly trendService: TrendAnalysisService
  ) {}

  @Get()
  async getDashboard(@Query('tenantId') tenantId: string): Promise<SearchAnalyticsDashboard> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      totalSearches: 12500,
      uniqueUsers: 3400,
      averageClickThroughRate: 42.5,
      zeroResultRate: 2.1,
      abandonmentRate: 15.3,
      topQueries: ['invoice', 'inventory', 'schedule', 'employee']
    };
  }

  @Get('trends')
  async getTrends(@Query('tenantId') tenantId: string): Promise<SearchTrendReport> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      timeframe: '7d',
      risingQueries: [
        { query: 'holiday schedule', growthPercent: 150 }
      ],
      fallingQueries: [
        { query: 'q3 report', dropPercent: 80 }
      ],
      seasonalQueries: []
    };
  }

  @Get('slow-queries')
  async getSlowQueries(@Query('tenantId') tenantId: string): Promise<SlowQueryReport> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      reportDate: new Date(),
      queries: [
        {
          query: 'deep wildcard search *foo*',
          averageLatencyMs: 1200,
          p99LatencyMs: 2500,
          volume: 12
        }
      ]
    };
  }

  @Get('recommendations')
  async getRecommendations(@Query('tenantId') tenantId: string): Promise<RecommendationReport> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      totalRecommendations: 3,
      criticalSuggestions: 1,
      suggestions: [
        {
          id: 'sug-1',
          type: 'SYNONYM',
          description: "Add synonym 'fries' for 'french fries' due to high zero-result rate",
          impactScore: 85
        }
      ]
    };
  }

  @Get('optimization')
  async getOptimizationStatus(@Query('tenantId') tenantId: string): Promise<OptimizationReport> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      lastRun: new Date(Date.now() - 86400000), // 1 day ago
      optimizationsApplied: 12,
      estimatedPerformanceGainPercent: 15,
      status: 'COMPLETED'
    };
  }

  @Post('optimization/run')
  async triggerOptimization(@Query('tenantId') tenantId: string): Promise<{ status: string }> {
    if (!tenantId) throw new Error('tenantId is required');
    // Trigger async job
    this.optimizationScheduler.runDailyOptimizationJobs(tenantId).catch(console.error);
    return { status: 'STARTED' };
  }

  @Get('health')
  async getHealth(@Query('tenantId') tenantId: string): Promise<any> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      status: 'HEALTHY',
      analyticsLatencyMs: 4,
      lastEventIngested: new Date()
    };
  }
}
