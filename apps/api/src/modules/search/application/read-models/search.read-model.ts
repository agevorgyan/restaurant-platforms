export interface SearchResultPage {
  tenantId: string;
  query: string;
  page: number;
  limit: number;
  totalHits: number;
  hits: Array<{
    id: string;
    module: string;
    title: string;
    snippet: string;
    url: string;
  }>;
  facets: Array<{
    field: string;
    counts: Array<{ value: string; count: number }>;
  }>;
  tookMs: number;
}

export interface PopularSearches {
  tenantId: string;
  period: string; // e.g. "7d"
  searches: Array<{
    query: string;
    count: number;
  }>;
}

export interface RecentSearches {
  tenantId: string;
  userId: string;
  searches: Array<{
    query: string;
    timestamp: Date;
  }>;
}

export interface SearchStatistics {
  tenantId: string;
  totalQueries: number;
  zeroHitQueries: number;
  averageLatencyMs: number;
  p95LatencyMs: number;
  topModules: Array<{ module: string; hitCount: number }>;
}

export interface SearchHealth {
  clusterStatus: 'green' | 'yellow' | 'red';
  activeNodes: number;
  totalDocuments: number;
  pendingSyncQueueSize: number;
  averageIndexLatencyMs: number;
}
