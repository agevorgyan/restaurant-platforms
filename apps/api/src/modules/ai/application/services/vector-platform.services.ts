/**
 * Enterprise Embedding & Vector Platform - Domain & Application Services
 *
 * Implements core application services:
 * 1. ChunkingService
 * 2. EmbeddingService
 * 3. SimilaritySearchService
 * 4. CollectionService
 * 5. IndexService
 * 6. EnterpriseVectorPlatformService
 */

import { Injectable, Inject, Logger } from '@nestjs/common';
import { VectorCollectionAggregate } from '../../domain/models/vector-collection.aggregate';
import { VectorEmbeddingEntity } from '../../domain/models/vector-embedding.entity';
import {
  VectorCollectionId,
  SearchQuery,
  SearchResult,
  ChunkMetadata,
} from '../../domain/value-objects/vector-vo';
import { SimilarityMetric } from '../../domain/enums/vector.enums';
import { EmbeddingRepositoryPort, VectorStorePort } from '../../domain/ports/vector.ports';
import { EVENT_PUBLISHER_TOKEN } from '../../../integration/application/services/connector-platform.services';
import { EventPublisherPort } from '../../../integration/domain/ports/connector.ports';
import {
  CreateCollectionDto,
  GenerateEmbeddingDto,
  SemanticSearchDto,
  VectorResponseDto,
} from '../dto/vector.dto';
import {
  VectorCollections,
  EmbeddingCatalog,
  SemanticSearchHistory,
  IndexStatus,
  CollectionStatistics,
} from '../read-models/vector.read-models';
import { CollectionNotFoundException } from '../../domain/exceptions/vector.exceptions';

export const EMBEDDING_REPOSITORY_TOKEN = 'EmbeddingRepositoryPort';
export const VECTOR_STORE_TOKEN = 'VectorStorePort';

/**
 * Service 1: ChunkingService
 * Configurable text chunking with configurable overlap.
 */
@Injectable()
export class ChunkingService {
  public chunkText(text: string, chunkSize: number = 500, chunkOverlap: number = 50): { chunk: string; metadata: ChunkMetadata }[] {
    const trimmed = text.trim();
    if (!trimmed) return [];

    const chunks: { chunk: string; metadata: ChunkMetadata }[] = [];
    let start = 0;
    let index = 0;

    while (start < trimmed.length) {
      const end = Math.min(start + chunkSize, trimmed.length);
      const chunkStr = trimmed.substring(start, end);
      const metadata = ChunkMetadata.create(index, start, end);

      chunks.push({ chunk: chunkStr, metadata });

      if (end === trimmed.length) break;
      start += (chunkSize - chunkOverlap);
      index++;
    }

    return chunks;
  }
}

/**
 * Service 2: EmbeddingService
 * Generates vector floats (e.g. 1536 floats) for input text.
 */
@Injectable()
export class EmbeddingService {
  public generateEmbeddingVector(text: string, dimension: number = 1536): number[] {
    // Generate deterministic normalized mock embedding vector for text
    const vector: number[] = new Array(dimension);
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }

    let sumSq = 0;
    for (let i = 0; i < dimension; i++) {
      const val = Math.sin(hash + i);
      vector[i] = val;
      sumSq += val * val;
    }

    const norm = Math.sqrt(sumSq) || 1;
    for (let i = 0; i < dimension; i++) {
      vector[i] /= norm;
    }

    return vector;
  }
}

/**
 * Service 3: SimilaritySearchService & CollectionService & IndexService & EnterpriseVectorPlatformService
 * High-level unified facade for vector indexing, semantic search, and collection management.
 */
@Injectable()
export class EnterpriseVectorPlatformService {
  private readonly logger = new Logger(EnterpriseVectorPlatformService.name);

  constructor(
    @Inject(EMBEDDING_REPOSITORY_TOKEN)
    private readonly repo: EmbeddingRepositoryPort,
    @Inject(VECTOR_STORE_TOKEN)
    private readonly vectorStore: VectorStorePort,
    @Inject(EVENT_PUBLISHER_TOKEN)
    private readonly eventPublisher: EventPublisherPort,
    private readonly chunkingService: ChunkingService,
    private readonly embeddingService: EmbeddingService
  ) {}

  public async createCollection(tenantId: string, dto: CreateCollectionDto): Promise<VectorCollectionAggregate> {
    const aggregate = VectorCollectionAggregate.create({
      tenantId,
      name: dto.name,
      description: dto.description,
      type: dto.type,
      dimension: dto.dimension,
      model: dto.model,
      metric: dto.metric,
    });

    await this.repo.saveCollection(aggregate);
    await this.eventPublisher.publishAll(aggregate.getUncommittedEvents());
    aggregate.clearEvents();

    return aggregate;
  }

  public async generateAndIndexEmbedding(tenantId: string, dto: GenerateEmbeddingDto): Promise<VectorResponseDto[]> {
    const collection = await this.repo.findCollectionById(VectorCollectionId.create(dto.collectionId));
    if (!collection) throw new CollectionNotFoundException(dto.collectionId);

    const textChunks = this.chunkingService.chunkText(dto.text, dto.chunkSize, dto.chunkOverlap);
    const results: VectorResponseDto[] = [];

    for (const { chunk, metadata } of textChunks) {
      const vector = this.embeddingService.generateEmbeddingVector(chunk, collection.getDimension().dimension);
      collection.validateVector(vector);

      const entity = VectorEmbeddingEntity.create({
        collectionId: collection.getId(),
        tenantId,
        vectorType: dto.vectorType,
        contentChunk: chunk,
        vector,
        chunkMetadata: metadata,
        customMetadata: dto.metadata || {},
      });

      await this.repo.saveEmbedding(entity);
      await this.vectorStore.indexVector(collection.getId().getValue(), entity);
      collection.incrementVectorCount(1);

      results.push({
        id: entity.getId().getValue(),
        collectionId: collection.getId().getValue(),
        vectorType: entity.getVectorType(),
        contentChunk: chunk,
        dimension: vector.length,
        status: entity.getStatus(),
        createdAt: entity.getCreatedAt(),
      });
    }

    await this.repo.saveCollection(collection);
    return results;
  }

  public async searchSimilar(tenantId: string, dto: SemanticSearchDto): Promise<SearchResult[]> {
    const collection = await this.repo.findCollectionById(VectorCollectionId.create(dto.collectionId));
    if (!collection) throw new CollectionNotFoundException(dto.collectionId);

    const queryVector = this.embeddingService.generateEmbeddingVector(dto.queryText, collection.getDimension().dimension);
    const searchQuery = SearchQuery.create({
      queryText: dto.queryText,
      topK: dto.topK,
      metric: dto.metric || collection.getMetric(),
      filter: dto.filter,
    });

    return this.vectorStore.searchSimilar(collection.getId().getValue(), queryVector, searchQuery);
  }

  public async getCollections(tenantId?: string): Promise<VectorCollections> {
    const list = await this.repo.findCollections(tenantId);
    const collections = list.map(c => ({
      id: c.getId().getValue(),
      name: c.getName(),
      description: c.getDescription(),
      type: c.getType(),
      dimension: c.getDimension().dimension,
      model: c.getModel().getValue(),
      metric: c.getMetric(),
      vectorCount: c.getVectorCount(),
      createdAt: c.getCreatedAt(),
    }));

    return {
      totalCount: collections.length,
      collections,
    };
  }

  public async getEmbeddingCatalog(collectionId?: string): Promise<EmbeddingCatalog> {
    if (!collectionId) {
      return { totalEmbeddings: 0, embeddings: [] };
    }

    const list = await this.repo.findEmbeddingsByCollection(VectorCollectionId.create(collectionId));
    const embeddings = list.map(e => ({
      id: e.getId().getValue(),
      collectionId: e.getCollectionId().getValue(),
      vectorType: e.getVectorType(),
      contentSnippet: e.getContentChunk().substring(0, 80),
      status: e.getStatus(),
      createdAt: e.getCreatedAt(),
    }));

    return {
      totalEmbeddings: embeddings.length,
      embeddings,
    };
  }

  public async rebuildIndex(collectionId: string): Promise<IndexStatus> {
    const collection = await this.repo.findCollectionById(VectorCollectionId.create(collectionId));
    if (!collection) throw new CollectionNotFoundException(collectionId);

    const { indexedCount } = await this.vectorStore.rebuildIndex(collectionId);

    return {
      collectionId,
      isIndexed: true,
      totalVectors: indexedCount,
      lastRebuiltAt: new Date(),
    };
  }
}
