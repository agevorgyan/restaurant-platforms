/**
 * Enterprise Embedding & Vector Platform - CQRS Read Models
 */

import { CollectionType, SimilarityMetric, VectorType } from '../../domain/enums/vector.enums';

export interface VectorCollectionEntry {
  id: string;
  name: string;
  description: string;
  type: CollectionType;
  dimension: number;
  model: string;
  metric: SimilarityMetric;
  vectorCount: number;
  createdAt: Date;
}

export interface VectorCollections {
  totalCount: number;
  collections: VectorCollectionEntry[];
}

export interface EmbeddingCatalogEntry {
  id: string;
  collectionId: string;
  vectorType: VectorType;
  contentSnippet: string;
  status: string;
  createdAt: Date;
}

export interface EmbeddingCatalog {
  totalEmbeddings: number;
  embeddings: EmbeddingCatalogEntry[];
}

export interface SemanticSearchHistoryItem {
  id: string;
  tenantId: string;
  collectionId: string;
  queryText: string;
  resultsCount: number;
  durationMs: number;
  timestamp: Date;
}

export interface SemanticSearchHistory {
  totalSearches: number;
  history: SemanticSearchHistoryItem[];
}

export interface CollectionStatistics {
  collectionId: string;
  name: string;
  vectorCount: number;
  dimension: number;
  indexSizeBytes: number;
  avgSearchLatencyMs: number;
}

export interface EmbeddingUsage {
  totalEmbeddingsGenerated: number;
  totalTokensProcessed: number;
  byCollection: Record<string, number>;
}

export interface IndexStatus {
  collectionId: string;
  isIndexed: boolean;
  totalVectors: number;
  lastRebuiltAt: Date;
}
