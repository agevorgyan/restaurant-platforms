export interface SearchDocument {
  documentId: string;
  tenantId: string;
  title: string;
  type: string;
  mimeType: string;
  sizeBytes: number;
  tags: string[];
  categories: string[];
  textContent?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any>;
}

export interface SearchStatistics {
  tenantId: string;
  totalQueries: number;
  averageLatencyMs: number;
  zeroHitQueries: number;
  period: string; // YYYY-MM
}

export interface IndexStatistics {
  tenantId: string;
  totalDocumentsIndexed: number;
  totalIndexSizeBytes: number;
  lastSyncTime: Date;
  status: 'HEALTHY' | 'SYNCING' | 'DEGRADED';
}

export interface PopularSearches {
  tenantId: string;
  queries: Array<{
    term: string;
    count: number;
  }>;
  period: string; // YYYY-MM
}

export interface FailedIndexJobs {
  jobId: string;
  documentId: string;
  tenantId: string;
  errorCode: string;
  errorMessage: string;
  failedAt: Date;
  retryCount: number;
}
