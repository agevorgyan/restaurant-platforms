/**
 * Enterprise Embedding & Vector Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, Dimension Validation, Text Chunking Engine, Cosine / Euclidean Distance Metrics,
 * Metadata Filtering, pgvector Abstraction, and Platform Services.
 */

import {
  VectorDimension,
  SearchQuery,
  SearchResult,
} from './domain/value-objects/vector-vo';
import { CollectionType, SimilarityMetric, VectorType } from './domain/enums/vector.enums';
import { InvalidVectorDimensionException, CollectionNotFoundException } from './domain/exceptions/vector.exceptions';
import { VectorCollectionAggregate } from './domain/models/vector-collection.aggregate';
import { VectorEmbeddingEntity } from './domain/models/vector-embedding.entity';
import { InMemoryEmbeddingRepository } from './infrastructure/repositories/in-memory-embedding.repository';
import { InMemoryVectorStoreAdapter } from './infrastructure/repositories/pgvector-store.adapter';
import { NestEventPublisherAdapter } from '../integration/infrastructure/adapters/connector.adapters';
import {
  ChunkingService,
  EmbeddingService,
  EnterpriseVectorPlatformService,
} from './application/services/vector-platform.services';

describe('Enterprise Embedding & Vector Platform', () => {
  describe('Value Objects & Vector Dimension Validation', () => {
    it('should create VectorDimension and validate array length', () => {
      const dim = VectorDimension.create(1536);
      expect(dim.dimension).toBe(1536);

      const validVec = new Array(1536).fill(0.1);
      expect(() => dim.validate(validVec)).not.toThrow();

      const invalidVec = new Array(512).fill(0.1);
      expect(() => dim.validate(invalidVec)).toThrow(InvalidVectorDimensionException);
    });
  });

  describe('Chunking Engine', () => {
    it('should split long document text into overlapping chunks', () => {
      const chunkingService = new ChunkingService();
      const longText = 'Restaurant Platform rule 1. Restaurant Platform rule 2. Restaurant Platform rule 3. Restaurant Platform rule 4.';

      const chunks = chunkingService.chunkText(longText, 40, 10);
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks[0].metadata.chunkIndex).toBe(0);
      expect(chunks[0].chunk.length).toBeLessThanOrEqual(40);
    });
  });

  describe('Vector Store & Distance Metrics', () => {
    let vectorStore: InMemoryVectorStoreAdapter;

    beforeEach(() => {
      vectorStore = new InMemoryVectorStoreAdapter();
    });

    it('should index and perform Cosine similarity search with metadata filtering', async () => {
      const colId = 'col-knowledge-1';

      const embedding1 = VectorEmbeddingEntity.create({
        collectionId: { getValue: () => colId } as any,
        tenantId: 'tenant-main',
        contentChunk: 'Neapolitan Margherita Pizza with fresh basil and mozzarella',
        vector: [0.9, 0.1, 0.0],
        customMetadata: { category: 'PIZZA', inStock: true },
      });

      const embedding2 = VectorEmbeddingEntity.create({
        collectionId: { getValue: () => colId } as any,
        tenantId: 'tenant-main',
        contentChunk: 'Sushi Salmon Nigiri with soy sauce and wasabi',
        vector: [0.0, 0.9, 0.1],
        customMetadata: { category: 'SUSHI', inStock: true },
      });

      await vectorStore.indexVector(colId, embedding1);
      await vectorStore.indexVector(colId, embedding2);

      // Search for Pizza query vector [0.95, 0.05, 0.0]
      const query = SearchQuery.create({
        queryText: 'Pizza',
        topK: 2,
        metric: SimilarityMetric.COSINE,
        filter: { category: 'PIZZA' },
      });

      const results = await vectorStore.searchSimilar(colId, [0.95, 0.05, 0.0], query);
      expect(results.length).toBe(1);
      expect(results[0].contentChunk).toContain('Margherita Pizza');
      expect(results[0].score).toBeGreaterThan(0.9);
    });
  });

  describe('Vector Platform Services & End-to-End Pipeline', () => {
    let repo: InMemoryEmbeddingRepository;
    let vectorStore: InMemoryVectorStoreAdapter;
    let publisherAdapter: NestEventPublisherAdapter;
    let chunkingService: ChunkingService;
    let embeddingService: EmbeddingService;
    let vectorPlatformService: EnterpriseVectorPlatformService;

    beforeEach(() => {
      repo = new InMemoryEmbeddingRepository();
      vectorStore = new InMemoryVectorStoreAdapter();
      publisherAdapter = new NestEventPublisherAdapter();
      chunkingService = new ChunkingService();
      embeddingService = new EmbeddingService();

      vectorPlatformService = new EnterpriseVectorPlatformService(
        repo,
        vectorStore,
        publisherAdapter,
        chunkingService,
        embeddingService
      );
    });

    it('should create collection, generate embeddings, and execute semantic search', async () => {
      // 1. Create Vector Collection
      const collection = await vectorPlatformService.createCollection('tenant-main', {
        name: 'Restaurant Menu Vector Collection',
        description: 'Menu item embeddings for semantic dish recommendations',
        type: CollectionType.MENU,
        dimension: 1536,
        model: 'text-embedding-3-small',
        metric: SimilarityMetric.COSINE,
      });

      expect(collection.getName()).toBe('Restaurant Menu Vector Collection');
      expect(collection.getDimension().dimension).toBe(1536);

      // 2. Generate and Index Embedding
      const indexedList = await vectorPlatformService.generateAndIndexEmbedding('tenant-main', {
        collectionId: collection.getId().getValue(),
        vectorType: VectorType.MENU_EMBEDDING,
        text: 'Artisanal Truffle Mushroom Risotto with arborio rice and parmesan cheese.',
        chunkSize: 200,
        chunkOverlap: 20,
        metadata: { category: 'RISOTTO' },
      });

      expect(indexedList.length).toBe(1);
      expect(indexedList[0].contentChunk).toContain('Truffle Mushroom Risotto');

      // 3. Execute Semantic Search
      const searchResults = await vectorPlatformService.searchSimilar('tenant-main', {
        collectionId: collection.getId().getValue(),
        queryText: 'mushroom rice dish',
        topK: 5,
      });

      expect(searchResults.length).toBe(1);
      expect(searchResults[0].contentChunk).toContain('Truffle Mushroom Risotto');

      // 4. Query Collection & Index Status
      const collections = await vectorPlatformService.getCollections('tenant-main');
      expect(collections.totalCount).toBe(1);

      const indexStatus = await vectorPlatformService.rebuildIndex(collection.getId().getValue());
      expect(indexStatus.isIndexed).toBe(true);
    });
  });
});
