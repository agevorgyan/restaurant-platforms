export interface KnowledgeCatalog {
  tenantId: string;
  documentId: string;
  sourceType: string;
  title: string;
  chunkCount: number;
  totalTokens: number;
  lastIndexedAt: Date;
}

export interface RetrievalHistory {
  tenantId: string;
  retrievalId: string;
  query: string;
  strategy: string;
  status: string;
  retrievedChunkCount: number;
  contextTokenCount: number;
  executionTimeMs: number;
  createdAt: Date;
}

export interface EmbeddingStatistics {
  tenantId: string;
  totalDocumentsIndexed: number;
  totalChunks: number;
  totalTokensEmbedded: number;
  lastIndexingJobAt: Date;
}

export interface ContextStatistics {
  tenantId: string;
  averageRetrievalTimeMs: number;
  averageContextTokens: number;
  cacheHitRate: number;
  period: string;
}

export interface KnowledgeFreshnessReport {
  tenantId: string;
  freshDocumentsCount: number;
  staleDocumentsCount: number;
  staleDocuments: Array<{
    documentId: string;
    lastIndexedAt: Date;
    daysStale: number;
  }>;
}
