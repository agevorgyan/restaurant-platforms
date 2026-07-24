import { Controller, Get, Post, Body, Param, Query, Headers } from '@nestjs/common';
import { 
  IndexCoordinator, 
  IndexOptimizationService, 
  IndexHealthService 
} from '../../domain/services';
import { 
  IndexStatistics, 
  IndexHealth, 
  IndexHistory 
} from '../../application/read-models';

@Controller('search/indexes')
export class EnterpriseIndexingController {
  constructor(
    private readonly coordinator: IndexCoordinator,
    private readonly optimizationService: IndexOptimizationService,
    private readonly healthService: IndexHealthService
  ) {}

  @Get()
  async getIndexes(@Query('tenantId') tenantId: string): Promise<IndexStatistics[]> {
    if (!tenantId) throw new Error('tenantId is required');
    return [
      {
        tenantId,
        module: 'customers',
        alias: `${tenantId}_customers`,
        activeVersion: `${tenantId}_customers_v1`,
        documentCount: 15420,
        sizeBytes: 10485760, // 10MB
        lastUpdated: new Date()
      }
    ];
  }

  @Get(':name')
  async getIndexHistory(
    @Param('name') indexName: string,
    @Query('tenantId') tenantId: string
  ): Promise<IndexHistory> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      module: indexName,
      versions: [
        { versionName: `${tenantId}_${indexName}_v1`, createdAt: new Date(), status: 'ACTIVE', docCount: 15420 }
      ]
    };
  }

  @Post('reindex')
  async triggerReindex(
    @Query('tenantId') tenantId: string,
    @Body() payload: { module: string; newSchema: any }
  ): Promise<{ jobId: string }> {
    if (!tenantId || !payload.module || !payload.newSchema) {
      throw new Error('tenantId, module, and newSchema are required');
    }
    const jobId = await this.coordinator.orchestrateZeroDowntimeReindex(tenantId, payload.module, payload.newSchema);
    return { jobId };
  }

  @Post('optimize')
  async optimizeIndex(
    @Query('tenantId') tenantId: string,
    @Body() payload: { indexName: string }
  ): Promise<{ status: string }> {
    if (!tenantId || !payload.indexName) throw new Error('tenantId and indexName are required');
    await this.optimizationService.optimizeIndex(tenantId, payload.indexName);
    return { status: 'OPTIMIZATION_INITIATED' };
  }

  @Get('statistics/overview')
  async getGlobalStatistics(@Query('tenantId') tenantId: string): Promise<{ totalDocuments: number; totalSizeBytes: number }> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      totalDocuments: 15420,
      totalSizeBytes: 10485760
    };
  }

  @Get('health/status')
  async getHealth(@Query('tenantId') tenantId: string): Promise<IndexHealth> {
    if (!tenantId) throw new Error('tenantId is required');
    const health = await this.healthService.checkHealth(tenantId);
    return {
      tenantId,
      status: health.status.toUpperCase(),
      indices: [
        { name: `${tenantId}_customers`, health: 'green', docCount: 15420, syncLagMs: 15 }
      ]
    };
  }
}
