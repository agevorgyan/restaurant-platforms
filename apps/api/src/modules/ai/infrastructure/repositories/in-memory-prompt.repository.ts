/**
 * Enterprise Prompt Management Platform - In-Memory Repository
 */

import { Injectable } from '@nestjs/common';
import { PromptAggregate } from '../../domain/models/prompt.aggregate';
import { PromptId } from '../../domain/value-objects/prompt-vo';
import { PromptType, PromptStatus } from '../../domain/enums/prompt.enums';
import { PromptRepositoryPort } from '../../domain/ports/prompt.ports';

@Injectable()
export class InMemoryPromptRepository implements PromptRepositoryPort {
  private readonly store = new Map<string, PromptAggregate>();

  public async save(prompt: PromptAggregate): Promise<void> {
    this.store.set(prompt.getId().getValue(), prompt);
  }

  public async findById(id: PromptId): Promise<PromptAggregate | null> {
    return this.store.get(id.getValue()) || null;
  }

  public async findByNameAndVersion(name: string, version: string, tenantId?: string): Promise<PromptAggregate | null> {
    for (const p of this.store.values()) {
      if (
        p.getName().toLowerCase() === name.toLowerCase() &&
        p.getVersion().getValue() === version &&
        (!tenantId || p.getTenantId() === tenantId)
      ) {
        return p;
      }
    }
    return null;
  }

  public async findAll(filters?: {
    tenantId?: string;
    type?: PromptType;
    status?: PromptStatus;
    limit?: number;
    offset?: number;
  }): Promise<PromptAggregate[]> {
    let result = Array.from(this.store.values());

    if (filters?.tenantId) {
      result = result.filter(p => p.getTenantId() === filters.tenantId);
    }

    if (filters?.type) {
      result = result.filter(p => p.getType() === filters.type);
    }

    if (filters?.status) {
      result = result.filter(p => p.getStatus() === filters.status);
    }

    const offset = filters?.offset || 0;
    const limit = filters?.limit || 100;
    return result.slice(offset, offset + limit);
  }

  public clear(): void {
    this.store.clear();
  }
}
