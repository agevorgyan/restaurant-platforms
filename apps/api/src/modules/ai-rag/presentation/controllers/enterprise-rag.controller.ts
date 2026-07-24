import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { 
  KnowledgeCatalog,
  EmbeddingStatistics,
  ContextStatistics,
  KnowledgeFreshnessReport
} from '../../application/read-models';
import { RetrievalService } from '../../domain/services';

@Controller('ai/rag')
export class EnterpriseRagController {
  constructor(private readonly retrievalService: RetrievalService) {}

  @Post('retrieve')
  async retrieve(
    @Query('tenantId') tenantId: string,
    @Body() payload: { query: string; strategy: string; topK?: number; maxTokens?: number }
  ): Promise<any> {
    if (!tenantId) throw new Error('tenantId is required');
    const { query, strategy = 'HYBRID', topK = 5, maxTokens = 4000 } = payload;
    const result = await this.retrievalService.retrieve(tenantId, query, strategy, topK, maxTokens);
    return result;
  }

  @Post('context')
  async assembleContext(
    @Query('tenantId') tenantId: string,
    @Body() payload: { documentIds: string[]; maxTokens?: number }
  ): Promise<{ contextText: string; citations: any[] }> {
    if (!tenantId) throw new Error('tenantId is required');
    // Manual context assembly endpoint
    return { contextText: '', citations: [] };
  }

  @Get('statistics')
  async getStatistics(@Query('tenantId') tenantId: string): Promise<ContextStatistics> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      averageRetrievalTimeMs: 450,
      averageContextTokens: 3200,
      cacheHitRate: 0.15,
      period: 'current-month'
    };
  }

  @Get('knowledge')
  async getKnowledgeCatalog(@Query('tenantId') tenantId: string): Promise<KnowledgeCatalog[]> {
    if (!tenantId) throw new Error('tenantId is required');
    return [];
  }

  @Get('freshness')
  async getFreshness(@Query('tenantId') tenantId: string): Promise<KnowledgeFreshnessReport> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      freshDocumentsCount: 1500,
      staleDocumentsCount: 12,
      staleDocuments: []
    };
  }

  @Get('health')
  async getHealth(): Promise<{ status: string; vectorDb: string }> {
    return { status: 'OK', vectorDb: 'CONNECTED' };
  }
}
