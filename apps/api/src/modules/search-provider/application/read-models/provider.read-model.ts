export interface ProviderStatusView {
  providerId: string;
  name: string;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED' | 'MAINTENANCE';
  engineVersion: string;
  isPrimary: boolean;
}

export interface ProviderStatistics {
  providerId: string;
  totalQueries: number;
  totalIndices: number;
  totalDocuments: number;
  averageLatencyMs: number;
}

export interface ProviderCapabilities {
  providerId: string;
  engineType: string;
  supportedFeatures: string[];
}

export interface ProviderLatencyStatistics {
  providerId: string;
  p50Ms: number;
  p90Ms: number;
  p95Ms: number;
  p99Ms: number;
  timeWindow: string;
}

export interface ProviderHealthHistory {
  providerId: string;
  events: Array<{
    timestamp: Date;
    oldStatus: string;
    newStatus: string;
    reason?: string;
  }>;
}
