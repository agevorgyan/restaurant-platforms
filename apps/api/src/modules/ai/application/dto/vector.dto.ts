/**
 * Enterprise Embedding & Vector Platform - Application DTOs
 */

import { CollectionType, SimilarityMetric, VectorType } from '../../domain/enums/vector.enums';

export interface CreateCollectionDto {
  name: string;
  description: string;
  type?: CollectionType;
  dimension?: number;
  model?: string;
  metric?: SimilarityMetric;
}

export interface GenerateEmbeddingDto {
  collectionId: string;
  vectorType?: VectorType;
  text: string;
  chunkSize?: number;
  chunkOverlap?: number;
  metadata?: Record<string, unknown>;
}

export interface SemanticSearchDto {
  collectionId: string;
  queryText: string;
  topK?: number;
  metric?: SimilarityMetric;
  filter?: Record<string, unknown>;
}

export interface VectorResponseDto {
  id: string;
  collectionId: string;
  vectorType: VectorType;
  contentChunk: string;
  dimension: number;
  status: string;
  createdAt: Date;
}
