/**
 * Enterprise Connector Platform - In-Memory Connector Repository Implementation
 *
 * Provides a thread-safe, tenant-aware in-memory repository for ConnectorAggregates.
 */

import { Injectable } from '@nestjs/common';
import { ConnectorAggregate } from '../../domain/models/connector.aggregate';
import { ConnectorId } from '../../domain/value-objects/connector-vo';
import { ConnectorRepositoryPort, ConnectorSearchFilters } from '../../domain/ports/connector.ports';

@Injectable()
export class InMemoryConnectorRepository implements ConnectorRepositoryPort {
  private readonly store = new Map<string, ConnectorAggregate>();

  public async save(connector: ConnectorAggregate): Promise<void> {
    this.store.set(connector.getId().getValue(), connector);
  }

  public async findById(id: ConnectorId, tenantId?: string): Promise<ConnectorAggregate | null> {
    const connector = this.store.get(id.getValue());
    if (!connector) return null;
    if (tenantId && connector.getTenantId() !== tenantId) return null;
    return connector;
  }

  public async findByTenant(tenantId: string, filters?: ConnectorSearchFilters): Promise<ConnectorAggregate[]> {
    let result = Array.from(this.store.values()).filter(c => c.getTenantId() === tenantId);

    if (filters?.type) {
      result = result.filter(c => c.getType().getValue() === filters.type);
    }
    if (filters?.status) {
      result = result.filter(c => c.getStatus().getValue() === filters.status);
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(c => 
        c.getName().getValue().toLowerCase().includes(s) ||
        c.getMetadata().getProps().description.toLowerCase().includes(s)
      );
    }

    if (filters?.offset) {
      result = result.slice(filters.offset);
    }
    if (filters?.limit) {
      result = result.slice(0, filters.limit);
    }

    return result;
  }

  public async findCatalog(filters?: ConnectorSearchFilters): Promise<ConnectorAggregate[]> {
    let result = Array.from(this.store.values());

    if (filters?.type) {
      result = result.filter(c => c.getType().getValue() === filters.type);
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(c => 
        c.getName().getValue().toLowerCase().includes(s) ||
        c.getMetadata().getProps().description.toLowerCase().includes(s)
      );
    }

    if (filters?.offset) {
      result = result.slice(filters.offset);
    }
    if (filters?.limit) {
      result = result.slice(0, filters.limit);
    }

    return result;
  }

  public async findAll(filters?: ConnectorSearchFilters): Promise<ConnectorAggregate[]> {
    let result = Array.from(this.store.values());

    if (filters?.tenantId) {
      result = result.filter(c => c.getTenantId() === filters.tenantId);
    }
    if (filters?.type) {
      result = result.filter(c => c.getType().getValue() === filters.type);
    }
    if (filters?.status) {
      result = result.filter(c => c.getStatus().getValue() === filters.status);
    }

    if (filters?.offset) {
      result = result.slice(filters.offset);
    }
    if (filters?.limit) {
      result = result.slice(0, filters.limit);
    }

    return result;
  }

  public async delete(id: ConnectorId, tenantId: string): Promise<boolean> {
    const connector = await this.findById(id, tenantId);
    if (!connector) return false;
    return this.store.delete(id.getValue());
  }

  public clear(): void {
    this.store.clear();
  }
}
