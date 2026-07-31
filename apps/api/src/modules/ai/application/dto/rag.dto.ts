/**
 * Enterprise RAG Platform - Application DTOs
 */

import { RetrievalType, ContextType, RankingStrategy } from '../../domain/enums/rag.enums';

export interface ExecuteRagQueryDto {
  queryText: string;
  collectionIds: string[];
  retrievalType?: RetrievalType;
  contextType?: ContextType;
  rankingStrategy?: RankingStrategy;
  maxBudgetTokens?: number;
  topK?: number;
  filter?: Record<string, unknown>;
}

export interface CitationDto {
  citationId: string;
  sourceTitle: string;
  chunkId: string;
  excerpt: string;
  confidenceScore: number;
}

export interface RagResponseDto {
  sessionId: string;
  tenantId: string;
  queryText: string;
  answerText: string;
  citations: CitationDto[];
  groundingPercentage: number;
  isGroundingSufficient: boolean;
  totalTokensUsed: number;
  executedAt: Date;
}
