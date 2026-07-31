/**
 * Enterprise HTTP & API Integration Platform - Request History & Idempotency Repositories
 */

import { Injectable } from '@nestjs/common';
import { OutboundRequestAggregate } from '../../domain/models/outbound-request.aggregate';
import { RequestHistoryRepositoryPort, IdempotencyRepositoryPort } from '../../domain/ports/http.ports';

@Injectable()
export class InMemoryRequestHistoryRepository implements RequestHistoryRepositoryPort {
  private readonly store: OutboundRequestAggregate[] = [];

  public async saveRequest(request: OutboundRequestAggregate): Promise<void> {
    this.store.unshift(request); // Newest requests first
  }

  public async findHistory(filters?: {
    tenantId?: string;
    connectorId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<OutboundRequestAggregate[]> {
    let result = [...this.store];

    if (filters?.tenantId) {
      result = result.filter(r => r.getTenantId() === filters.tenantId);
    }
    if (filters?.connectorId) {
      result = result.filter(r => r.getConnectorId() === filters.connectorId);
    }
    if (filters?.status) {
      result = result.filter(r => r.getStatus() === filters.status);
    }

    if (filters?.offset) {
      result = result.slice(filters.offset);
    }
    if (filters?.limit) {
      result = result.slice(0, filters.limit);
    }

    return result;
  }

  public clear(): void {
    this.store.length = 0;
  }
}

@Injectable()
export class InMemoryIdempotencyRepository implements IdempotencyRepositoryPort {
  private readonly store = new Map<string, { requestId: string; expiresAt: number }>();

  public async hasKey(idempotencyKey: string): Promise<boolean> {
    const entry = this.store.get(idempotencyKey);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(idempotencyKey);
      return false;
    }
    return true;
  }

  public async storeKey(idempotencyKey: string, requestId: string, ttlMs: number = 86400000): Promise<void> {
    this.store.set(idempotencyKey, {
      requestId,
      expiresAt: Date.now() + ttlMs,
    });
  }

  public clear(): void {
    this.store.clear();
  }
}
