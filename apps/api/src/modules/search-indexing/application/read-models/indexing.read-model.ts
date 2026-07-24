export interface IndexStatistics {
  tenantId: string;
  module: string;
  alias: string;
  activeVersion: string;
  documentCount: number;
  sizeBytes: number;
  lastUpdated: Date;
}

export interface IndexHealth {
  tenantId: string;
  status: 'GREEN' | 'YELLOW' | 'RED';
  indices: Array<{
    name: string;
    health: 'green' | 'yellow' | 'red';
    docCount: number;
    syncLagMs: number;
  }>;
}

export interface IndexHistory {
  tenantId: string;
  module: string;
  versions: Array<{
    versionName: string;
    createdAt: Date;
    status: 'ACTIVE' | 'ARCHIVED' | 'DELETED';
    docCount: number;
  }>;
}

export interface FailedIndexJobs {
  jobId: string;
  tenantId: string;
  module: string;
  documentId: string;
  operation: 'UPSERT' | 'DELETE';
  errorReason: string;
  failedAt: Date;
  retryCount: number;
}

export interface ReindexProgress {
  jobId: string;
  tenantId: string;
  sourceIndex: string;
  targetIndex: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  totalDocuments: number;
  processedDocuments: number;
  failedDocuments: number;
  startedAt: Date;
  completedAt?: Date;
}
