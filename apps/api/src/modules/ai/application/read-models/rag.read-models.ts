/**
 * Enterprise RAG Platform - CQRS Read Models
 */

import { RetrievalStatus, RetrievalType } from '../../domain/enums/rag.enums';

export interface RetrievalHistoryItem {
  sessionId: string;
  tenantId: string;
  queryText: string;
  status: RetrievalStatus;
  chunksRetrievedCount: number;
  groundingPercentage: number;
  timestamp: Date;
}

export interface RetrievalHistory {
  totalQueries: number;
  history: RetrievalHistoryItem[];
}

export interface ContextStatistics {
  avgContextTokens: number;
  maxContextTokens: number;
  totalChunksAssembled: number;
}

export interface CitationHistoryEntry {
  citationId: string;
  sessionId: string;
  sourceTitle: string;
  chunkId: string;
  confidenceScore: number;
  timestamp: Date;
}

export interface CitationHistory {
  totalCitations: number;
  citations: CitationHistoryEntry[];
}

export interface GroundingMetrics {
  avgGroundingPercentage: number;
  sufficientGroundingCount: number;
  hallucinationsDetectedCount: number;
}

export interface SearchAnalytics {
  topQueries: { query: string; count: number }[];
  byRetrievalType: Record<RetrievalType, number>;
}

export interface KnowledgeCoverage {
  indexedCollectionsCount: number;
  totalChunksAvailable: number;
  coveragePercentage: number;
}
