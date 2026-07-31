/**
 * Enterprise AI Gateway - CQRS Read Models
 */

import { ProviderType, ModelType, ProviderStatus, InferenceStatus } from '../../domain/enums/ai.enums';

export interface ProviderCatalogEntry {
  id: string;
  name: string;
  type: ProviderType;
  status: ProviderStatus;
  priority: number;
  models: string[];
  capabilities: ModelType[];
}

export interface ProviderCatalog {
  totalCount: number;
  providers: ProviderCatalogEntry[];
}

export interface ModelCatalogEntry {
  modelId: string;
  providerType: ProviderType;
  capabilities: ModelType[];
  contextWindowTokens: number;
}

export interface ModelCatalog {
  totalModels: number;
  models: ModelCatalogEntry[];
}

export interface ProviderHealthDashboard {
  healthyCount: number;
  degradedCount: number;
  unavailableCount: number;
  providers: {
    providerName: string;
    type: ProviderType;
    status: ProviderStatus;
    lastPingAt: Date;
    latencyMs: number;
  }[];
}

export interface InferenceHistoryItem {
  jobId: string;
  tenantId: string;
  providerType: ProviderType;
  modelId: string;
  status: InferenceStatus;
  totalTokens: number;
  totalCostUsd: number;
  durationMs: number;
  failoverOccurred: boolean;
  timestamp: Date;
}

export interface InferenceHistory {
  totalJobsCount: number;
  history: InferenceHistoryItem[];
}

export interface CostDashboard {
  totalTokensUsed: number;
  totalCostUsd: number;
  costByProvider: Record<ProviderType, number>;
  costByTenant: Record<string, number>;
}

export interface LatencyDashboard {
  averageLatencyMs: number;
  p95LatencyMs: number;
  byProvider: Record<ProviderType, number>;
}
