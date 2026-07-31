/**
 * Enterprise Embedding & Vector Platform - Hexagonal Domain Ports
 */

import { VectorCollectionAggregate } from '../models/vector-collection.aggregate';
import { VectorEmbeddingEntity } from '../models/vector-embedding.entity';
import { VectorCollectionId, SearchQuery, SearchResult } from '../value-objects/vector-vo';

export interface EmbeddingRepositoryPort {
  saveCollection(collection: VectorCollectionAggregate): Promise<void>;
  findCollectionById(id: VectorCollectionId): Promise<VectorCollectionAggregate | null>;
  findCollections(tenantId?: string): Promise<VectorCollectionAggregate[]>;
  saveEmbedding(embedding: VectorEmbeddingEntity): Promise<void>;
  findEmbeddingsByCollection(collectionId: VectorCollectionId): Promise<VectorEmbeddingEntity[]>;
}

export interface VectorStorePort {
  indexVector(collectionId: string, embedding: VectorEmbeddingEntity): Promise<void>;
  deleteVector(collectionId: string, vectorId: string): Promise<void>;
  searchSimilar(collectionId: string, queryVector: number[], query: SearchQuery): Promise<SearchResult[]>;
  rebuildIndex(collectionId: string): Promise<{ indexedCount: number; durationMs: number }>;
}
