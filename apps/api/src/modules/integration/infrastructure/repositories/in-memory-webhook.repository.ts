/**
 * Enterprise Webhook Platform - In-Memory Repositories
 */

import { Injectable } from '@nestjs/common';
import { WebhookDeliveryAggregate } from '../../domain/models/webhook-delivery.aggregate';
import { WebhookId } from '../../domain/value-objects/webhook-vo';
import {
  WebhookRepositoryPort,
  DeadLetterRepositoryPort,
  NonceStorePort,
} from '../../domain/ports/webhook.ports';

@Injectable()
export class InMemoryWebhookRepository implements WebhookRepositoryPort {
  private readonly store = new Map<string, WebhookDeliveryAggregate>();

  public async save(delivery: WebhookDeliveryAggregate): Promise<void> {
    this.store.set(delivery.getId().getValue(), delivery);
  }

  public async findById(id: WebhookId): Promise<WebhookDeliveryAggregate | null> {
    return this.store.get(id.getValue()) || null;
  }

  public async findHistory(filters?: {
    tenantId?: string;
    connectorId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<WebhookDeliveryAggregate[]> {
    let result = Array.from(this.store.values());

    if (filters?.tenantId) {
      result = result.filter(w => w.getTenantId() === filters.tenantId);
    }
    if (filters?.connectorId) {
      result = result.filter(w => w.getConnectorId() === filters.connectorId);
    }
    if (filters?.status) {
      result = result.filter(w => w.getStatus() === filters.status);
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
    this.store.clear();
  }
}

@Injectable()
export class InMemoryDeadLetterRepository implements DeadLetterRepositoryPort {
  private readonly store = new Map<string, WebhookDeliveryAggregate>();

  public async save(delivery: WebhookDeliveryAggregate): Promise<void> {
    this.store.set(delivery.getId().getValue(), delivery);
  }

  public async findDeadLetters(filters?: {
    tenantId?: string;
    connectorId?: string;
    limit?: number;
    offset?: number;
  }): Promise<WebhookDeliveryAggregate[]> {
    let result = Array.from(this.store.values());

    if (filters?.tenantId) {
      result = result.filter(w => w.getTenantId() === filters.tenantId);
    }
    if (filters?.connectorId) {
      result = result.filter(w => w.getConnectorId() === filters.connectorId);
    }

    if (filters?.offset) {
      result = result.slice(filters.offset);
    }
    if (filters?.limit) {
      result = result.slice(0, filters.limit);
    }

    return result;
  }

  public async remove(id: WebhookId): Promise<boolean> {
    return this.store.delete(id.getValue());
  }

  public clear(): void {
    this.store.clear();
  }
}

@Injectable()
export class InMemoryNonceStore implements NonceStorePort {
  private readonly store = new Map<string, number>();

  public async hasNonce(nonce: string, connectorId: string): Promise<boolean> {
    const key = `${connectorId}:${nonce}`;
    const expiresAt = this.store.get(key);
    if (!expiresAt) return false;
    if (Date.now() > expiresAt) {
      this.store.delete(key);
      return false;
    }
    return true;
  }

  public async storeNonce(nonce: string, connectorId: string, ttlMs: number = 86400000): Promise<void> {
    const key = `${connectorId}:${nonce}`;
    this.store.set(key, Date.now() + ttlMs);
  }

  public clear(): void {
    this.store.clear();
  }
}
