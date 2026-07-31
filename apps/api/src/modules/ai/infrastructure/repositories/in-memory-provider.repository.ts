/**
 * Enterprise AI Gateway - In-Memory Repositories
 */

import { Injectable } from '@nestjs/common';
import { ProviderAggregate } from '../../domain/models/provider.aggregate';
import { InferenceJobAggregate } from '../../domain/models/inference-job.aggregate';
import { ProviderId } from '../../domain/value-objects/ai-vo';
import { ProviderType } from '../../domain/enums/ai.enums';
import { ProviderRepositoryPort, InferenceHistoryRepositoryPort } from '../../domain/ports/ai.ports';

@Injectable()
export class InMemoryProviderRepository implements ProviderRepositoryPort {
  private readonly store = new Map<string, ProviderAggregate>();

  public async save(provider: ProviderAggregate): Promise<void> {
    this.store.set(provider.getId().getValue(), provider);
  }

  public async findById(id: ProviderId): Promise<ProviderAggregate | null> {
    return this.store.get(id.getValue()) || null;
  }

  public async findByType(type: ProviderType): Promise<ProviderAggregate | null> {
    for (const p of this.store.values()) {
      if (p.getType() === type) return p;
    }
    return null;
  }

  public async findAll(tenantId?: string): Promise<ProviderAggregate[]> {
    let result = Array.from(this.store.values());
    if (tenantId) {
      result = result.filter(p => p.getTenantId() === tenantId);
    }
    return result;
  }

  public clear(): void {
    this.store.clear();
  }
}

@Injectable()
export class InMemoryInferenceHistoryRepository implements InferenceHistoryRepositoryPort {
  private readonly store = new Map<string, InferenceJobAggregate>();

  public async saveJob(job: InferenceJobAggregate): Promise<void> {
    this.store.set(job.getId(), job);
  }

  public async findById(id: string): Promise<InferenceJobAggregate | null> {
    return this.store.get(id) || null;
  }

  public async findHistory(tenantId?: string, limit: number = 100): Promise<InferenceJobAggregate[]> {
    let result = Array.from(this.store.values());
    if (tenantId) {
      result = result.filter(j => j.getTenantId() === tenantId);
    }
    return result.slice(0, limit);
  }

  public clear(): void {
    this.store.clear();
  }
}
