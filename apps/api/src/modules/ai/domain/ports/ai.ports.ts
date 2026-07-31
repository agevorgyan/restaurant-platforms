/**
 * Enterprise AI Gateway - Hexagonal Domain Ports
 */

import { ProviderAggregate } from '../models/provider.aggregate';
import { InferenceJobAggregate } from '../models/inference-job.aggregate';
import { ProviderId, InferenceRequest, InferenceResponse } from '../value-objects/ai-vo';
import { ProviderType } from '../enums/ai.enums';

export interface ProviderRepositoryPort {
  save(provider: ProviderAggregate): Promise<void>;
  findById(id: ProviderId): Promise<ProviderAggregate | null>;
  findByType(type: ProviderType): Promise<ProviderAggregate | null>;
  findAll(tenantId?: string): Promise<ProviderAggregate[]>;
}

export interface InferenceHistoryRepositoryPort {
  saveJob(job: InferenceJobAggregate): Promise<void>;
  findById(id: string): Promise<InferenceJobAggregate | null>;
  findHistory(tenantId?: string, limit?: number): Promise<InferenceJobAggregate[]>;
}

export interface ProviderAdapterPort {
  getProviderType(): ProviderType;
  executeInference(request: InferenceRequest, modelId: string): Promise<InferenceResponse>;
}
