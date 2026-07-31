/**
 * Enterprise Embedding & Vector Platform - REST Controller
 *
 * Exposes production REST API endpoints for vector collection management,
 * text chunking, embedding generation, semantic similarity search, and index maintenance.
 *
 * API Base Paths: /ai/embeddings, /ai/collections, /ai/index
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EnterpriseVectorPlatformService } from '../../application/services/vector-platform.services';
import {
  CreateCollectionDto,
  GenerateEmbeddingDto,
  SemanticSearchDto,
  VectorResponseDto,
} from '../../application/dto/vector.dto';
import {
  VectorCollections,
  EmbeddingCatalog,
  IndexStatus,
} from '../../application/read-models/vector.read-models';
import { SearchResult } from '../../domain/value-objects/vector-vo';

@Controller('ai')
export class EnterpriseVectorController {
  constructor(private readonly vectorService: EnterpriseVectorPlatformService) {}

  /**
   * GET /ai/collections
   * Retrieve catalog of vector collections and metrics.
   */
  @Get('collections')
  async getCollections(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<VectorCollections> {
    const tenantId = tenantHeader || undefined;
    return this.vectorService.getCollections(tenantId);
  }

  /**
   * POST /ai/collections
   * Create a new vector collection partition.
   */
  @Post('collections')
  @HttpCode(HttpStatus.CREATED)
  async createCollection(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: CreateCollectionDto
  ) {
    const tenantId = tenantHeader || 'tenant-default';
    return this.vectorService.createCollection(tenantId, dto);
  }

  /**
   * GET /ai/embeddings
   * Retrieve generated embedding catalog.
   */
  @Get('embeddings')
  async getEmbeddings(
    @Query('collectionId') collectionId?: string
  ): Promise<EmbeddingCatalog> {
    return this.vectorService.getEmbeddingCatalog(collectionId);
  }

  /**
   * POST /ai/embeddings
   * Generate text chunk embeddings and index into target vector collection.
   */
  @Post('embeddings')
  @HttpCode(HttpStatus.CREATED)
  async generateEmbedding(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: GenerateEmbeddingDto
  ): Promise<VectorResponseDto[]> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.vectorService.generateAndIndexEmbedding(tenantId, dto);
  }

  /**
   * POST /ai/embeddings/search
   * Execute semantic vector search across collection with metadata filtering.
   */
  @Post('embeddings/search')
  @HttpCode(HttpStatus.OK)
  async searchSimilar(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: SemanticSearchDto
  ): Promise<SearchResult[]> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.vectorService.searchSimilar(tenantId, dto);
  }

  /**
   * GET /ai/index
   * Retrieve vector index status details.
   */
  @Get('index')
  async getIndexStatus(
    @Query('collectionId') collectionId?: string
  ): Promise<IndexStatus> {
    return this.vectorService.rebuildIndex(collectionId || 'col-default');
  }

  /**
   * POST /ai/index/rebuild
   * Rebuild vector index for target collection.
   */
  @Post('index/rebuild')
  @HttpCode(HttpStatus.OK)
  async rebuildIndex(@Body('collectionId') collectionId: string): Promise<IndexStatus> {
    return this.vectorService.rebuildIndex(collectionId || 'col-default');
  }
}
