/**
 * Enterprise Data Transformation Platform - In-Memory Repositories
 */

import { Injectable } from '@nestjs/common';
import { TransformationAggregate } from '../../domain/models/transformation.aggregate';
import { TransformationId, SchemaDefinition } from '../../domain/value-objects/transformation-vo';
import { TransformationRepositoryPort, SchemaRepositoryPort } from '../../domain/ports/transformation.ports';

@Injectable()
export class InMemoryTransformationRepository implements TransformationRepositoryPort {
  private readonly store = new Map<string, TransformationAggregate>();

  public async save(transformation: TransformationAggregate): Promise<void> {
    this.store.set(transformation.getId().getValue(), transformation);
  }

  public async findById(id: TransformationId, tenantId?: string): Promise<TransformationAggregate | null> {
    const item = this.store.get(id.getValue());
    if (!item) return null;
    if (tenantId && item.getTenantId() !== tenantId) return null;
    return item;
  }

  public async findCatalog(filters?: {
    tenantId?: string;
    type?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<TransformationAggregate[]> {
    let result = Array.from(this.store.values());

    if (filters?.tenantId) {
      result = result.filter(t => t.getTenantId() === filters.tenantId);
    }
    if (filters?.type) {
      result = result.filter(t => t.getType() === filters.type);
    }
    if (filters?.status) {
      result = result.filter(t => t.getStatus() === filters.status);
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
export class InMemorySchemaRepository implements SchemaRepositoryPort {
  private readonly store = new Map<string, SchemaDefinition>();

  public async saveSchema(schema: SchemaDefinition, tenantId?: string): Promise<void> {
    const key = `${tenantId || 'global'}:${schema.name}:${schema.version.getValue()}`;
    this.store.set(key, schema);
  }

  public async findSchema(name: string, version?: string, tenantId?: string): Promise<SchemaDefinition | null> {
    const v = version || '1.0.0';
    const key = `${tenantId || 'global'}:${name}:${v}`;
    const direct = this.store.get(key);
    if (direct) return direct;

    // Fallback search by schema name
    for (const [k, s] of this.store.entries()) {
      if (s.name === name) return s;
    }
    return null;
  }

  public async getAllSchemas(tenantId?: string): Promise<SchemaDefinition[]> {
    return Array.from(this.store.values());
  }

  public clear(): void {
    this.store.clear();
  }
}
