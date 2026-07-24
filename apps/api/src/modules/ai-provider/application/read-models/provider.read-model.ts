export interface ProviderStatusView {
  providerId: string;
  name: string;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED' | 'MAINTENANCE';
  latencyMs: number;
  lastChecked: Date;
}

export interface ModelCatalog {
  modelId: string;
  name: string;
  providerId: string;
  capabilities: string[];
  maxContextTokens: number;
  inputCostPer1k: number;
  outputCostPer1k: number;
}

export interface ProviderCapabilities {
  providerId: string;
  supportedCapabilities: string[];
}

export interface ProviderLatencyStatistics {
  providerId: string;
  modelId: string;
  averageLatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
}

export interface ProviderHealthHistory {
  providerId: string;
  events: Array<{
    status: string;
    timestamp: Date;
    reason?: string;
  }>;
}

export interface CostStatistics {
  providerId: string;
  tenantId?: string;
  period: string; // e.g. '2023-10'
  totalCostUsd: number;
}
