export interface MediaCatalogEntry {
  mediaId: string;
  tenantId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  tags: string[];
  categories: string[];
  albumIds: string[];
  createdAt: Date;
  updatedAt: Date;
  indexVersion: number;
}

export interface MediaSearchStatistics {
  tenantId: string;
  totalQueries: number;
  averageLatencyMs: number;
  queriesWithZeroResults: number;
  period: string; // YYYY-MM
}

export interface PopularTags {
  tenantId: string;
  tags: Array<{ tag: string; count: number }>;
  period: string;
}

export interface PopularAlbums {
  tenantId: string;
  albums: Array<{ albumId: string; name: string; mediaCount: number }>;
}

export interface CatalogHealth {
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  indexDocCount: number;
  pendingSyncQueueSize: number;
  averageIndexingLatencyMs: number;
  failedIndexJobs: number;
}

export interface FailedIndexJobs {
  jobId: string;
  tenantId: string;
  mediaId: string;
  errorCode: string;
  errorMessage: string;
  failedAt: Date;
  retryCount: number;
}
