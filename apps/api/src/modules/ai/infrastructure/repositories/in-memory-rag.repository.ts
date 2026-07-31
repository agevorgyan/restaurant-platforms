/**
 * Enterprise RAG Platform - In-Memory RAG Repository
 */

import { Injectable } from '@nestjs/common';
import { RagSessionAggregate } from '../../domain/models/rag-session.aggregate';
import { RetrievalRequestId } from '../../domain/value-objects/rag-vo';
import { RagRepositoryPort } from '../../domain/ports/rag.ports';

@Injectable()
export class InMemoryRagRepository implements RagRepositoryPort {
  private readonly store = new Map<string, RagSessionAggregate>();

  public async saveSession(session: RagSessionAggregate): Promise<void> {
    this.store.set(session.getId().getValue(), session);
  }

  public async findSessionById(id: RetrievalRequestId): Promise<RagSessionAggregate | null> {
    return this.store.get(id.getValue()) || null;
  }

  public async findSessions(tenantId?: string, limit: number = 100): Promise<RagSessionAggregate[]> {
    let result = Array.from(this.store.values());
    if (tenantId) {
      result = result.filter(s => s.getTenantId() === tenantId);
    }
    return result.slice(0, limit);
  }

  public clear(): void {
    this.store.clear();
  }
}
