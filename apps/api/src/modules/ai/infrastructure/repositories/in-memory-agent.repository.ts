/**
 * Enterprise AI Agent Platform - In-Memory Repository
 */

import { Injectable } from '@nestjs/common';
import { AgentAggregate } from '../../domain/models/agent.aggregate';
import { AgentId } from '../../domain/value-objects/agent-vo';
import { AgentType, AgentStatus } from '../../domain/enums/agent.enums';
import { AgentRepositoryPort } from '../../domain/ports/agent.ports';

@Injectable()
export class InMemoryAgentRepository implements AgentRepositoryPort {
  private readonly store = new Map<string, AgentAggregate>();

  public async save(agent: AgentAggregate): Promise<void> {
    this.store.set(agent.getId().getValue(), agent);
  }

  public async findById(id: AgentId): Promise<AgentAggregate | null> {
    return this.store.get(id.getValue()) || null;
  }

  public async findAll(tenantId?: string, filters?: { type?: AgentType; status?: AgentStatus }): Promise<AgentAggregate[]> {
    let result = Array.from(this.store.values());

    if (tenantId) {
      result = result.filter(a => a.getTenantId() === tenantId);
    }

    if (filters?.type) {
      result = result.filter(a => a.getAgentType() === filters.type);
    }

    if (filters?.status) {
      result = result.filter(a => a.getStatus() === filters.status);
    }

    return result;
  }

  public clear(): void {
    this.store.clear();
  }
}
