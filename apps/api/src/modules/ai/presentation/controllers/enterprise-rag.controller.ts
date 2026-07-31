/**
 * Enterprise RAG Platform - REST Controller
 *
 * Exposes production REST API endpoints for semantic/hybrid query retrieval,
 * context budget assembly, grounded answer synthesis, citations, and grounding metrics.
 *
 * API Base Path: /ai/rag
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EnterpriseRagPlatformService } from '../../application/services/rag-platform.services';
import { ExecuteRagQueryDto, RagResponseDto } from '../../application/dto/rag.dto';
import {
  RetrievalHistory,
  ContextStatistics,
  CitationHistory,
  KnowledgeCoverage,
} from '../../application/read-models/rag.read-models';

@Controller('ai/rag')
export class EnterpriseRagController {
  constructor(private readonly ragService: EnterpriseRagPlatformService) {}

  /**
   * POST /ai/rag/query
   * Execute Retrieval-Augmented Generation (RAG) query with grounded AI Gateway inference.
   */
  @Post('query')
  @HttpCode(HttpStatus.OK)
  async executeRagQuery(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: ExecuteRagQueryDto
  ): Promise<RagResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.ragService.executeRagQuery(tenantId, dto);
  }

  /**
   * GET /ai/rag/history
   * Retrieve audit history of RAG queries and retrieval sessions.
   */
  @Get('history')
  async getRetrievalHistory(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<RetrievalHistory> {
    const tenantId = tenantHeader || undefined;
    return this.ragService.getRetrievalHistory(tenantId);
  }

  /**
   * GET /ai/rag/statistics
   * Retrieve statistics on context token budgets and assembled chunk usage.
   */
  @Get('statistics')
  async getContextStatistics(): Promise<ContextStatistics> {
    return this.ragService.getContextStatistics();
  }

  /**
   * GET /ai/rag/citations
   * Retrieve generated source citations audit log.
   */
  @Get('citations')
  async getCitationHistory(): Promise<CitationHistory> {
    return this.ragService.getCitationHistory();
  }

  /**
   * GET /ai/rag/coverage
   * Retrieve knowledge base indexing coverage metrics.
   */
  @Get('coverage')
  async getKnowledgeCoverage(): Promise<KnowledgeCoverage> {
    return this.ragService.getKnowledgeCoverage();
  }
}
