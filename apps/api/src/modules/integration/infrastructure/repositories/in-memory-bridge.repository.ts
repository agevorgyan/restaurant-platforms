/**
 * Enterprise Integration Event Bridge - In-Memory Repositories
 */

import { Injectable } from '@nestjs/common';
import { BridgeEventAggregate } from '../../domain/models/bridge-event.aggregate';
import { BridgeEventId, BridgeRoute } from '../../domain/value-objects/bridge-vo';
import {
  BridgeRepositoryPort,
  BridgeDLQRepositoryPort,
  BridgeRouteRegistryPort,
} from '../../domain/ports/bridge.ports';

@Injectable()
export class InMemoryBridgeRepository implements BridgeRepositoryPort {
  private readonly store = new Map<string, BridgeEventAggregate>();

  public async save(event: BridgeEventAggregate): Promise<void> {
    this.store.set(event.getId().getValue(), event);
  }

  public async findById(id: BridgeEventId): Promise<BridgeEventAggregate | null> {
    return this.store.get(id.getValue()) || null;
  }

  public async findHistory(filters?: {
    tenantId?: string;
    connectorId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<BridgeEventAggregate[]> {
    let result = Array.from(this.store.values());

    if (filters?.tenantId) {
      result = result.filter(b => b.getTenantId() === filters.tenantId);
    }
    if (filters?.connectorId) {
      result = result.filter(b => b.getConnectorId() === filters.connectorId);
    }
    if (filters?.status) {
      result = result.filter(b => b.getStatus() === filters.status);
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
export class InMemoryBridgeDLQRepository implements BridgeDLQRepositoryPort {
  private readonly store = new Map<string, BridgeEventAggregate>();

  public async save(event: BridgeEventAggregate): Promise<void> {
    this.store.set(event.getId().getValue(), event);
  }

  public async findDeadLetters(filters?: {
    tenantId?: string;
    connectorId?: string;
    limit?: number;
    offset?: number;
  }): Promise<BridgeEventAggregate[]> {
    let result = Array.from(this.store.values());

    if (filters?.tenantId) {
      result = result.filter(b => b.getTenantId() === filters.tenantId);
    }
    if (filters?.connectorId) {
      result = result.filter(b => b.getConnectorId() === filters.connectorId);
    }

    if (filters?.offset) {
      result = result.slice(filters.offset);
    }
    if (filters?.limit) {
      result = result.slice(0, filters.limit);
    }

    return result;
  }

  public async remove(id: BridgeEventId): Promise<boolean> {
    return this.store.delete(id.getValue());
  }

  public clear(): void {
    this.store.clear();
  }
}

@Injectable()
export class InMemoryBridgeRouteRegistry implements BridgeRouteRegistryPort {
  private readonly routes = new Map<string, BridgeRoute>();

  public async resolveRoute(sourceEventType: string, connectorId: string): Promise<BridgeRoute | null> {
    const key = `${connectorId}:${sourceEventType}`;
    return this.routes.get(key) || this.routes.get(`global:${sourceEventType}`) || null;
  }

  public async registerRoute(route: BridgeRoute, connectorId: string = 'global'): Promise<void> {
    const key = `${connectorId}:${route.sourceEventType}`;
    this.routes.set(key, route);
  }

  public clear(): void {
    this.routes.clear();
  }
}
