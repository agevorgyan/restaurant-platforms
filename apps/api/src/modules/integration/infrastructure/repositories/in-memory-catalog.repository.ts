/**
 * Enterprise Integration Catalog - In-Memory Repository
 */

import { Injectable } from '@nestjs/common';
import { CatalogEntryAggregate } from '../../domain/models/catalog-entry.aggregate';
import { CatalogId } from '../../domain/value-objects/catalog-vo';
import { CatalogType, CertificationLevel } from '../../domain/enums/catalog.enums';
import { CatalogRepositoryPort } from '../../domain/ports/catalog.ports';

@Injectable()
export class InMemoryCatalogRepository implements CatalogRepositoryPort {
  private readonly store = new Map<string, CatalogEntryAggregate>();

  public async save(entry: CatalogEntryAggregate): Promise<void> {
    this.store.set(entry.getId().getValue(), entry);
  }

  public async findById(id: CatalogId): Promise<CatalogEntryAggregate | null> {
    return this.store.get(id.getValue()) || null;
  }

  public async findAll(filters?: {
    tenantId?: string;
    type?: CatalogType;
    certificationLevel?: CertificationLevel;
    vendorName?: string;
    limit?: number;
    offset?: number;
  }): Promise<CatalogEntryAggregate[]> {
    let result = Array.from(this.store.values());

    if (filters?.tenantId) {
      result = result.filter(c => c.getTenantId() === filters.tenantId);
    }
    if (filters?.type) {
      result = result.filter(c => c.getType() === filters.type);
    }
    if (filters?.certificationLevel) {
      result = result.filter(c => c.getCertification().level === filters.certificationLevel);
    }
    if (filters?.vendorName) {
      result = result.filter(c => c.getVendor().name.toLowerCase().includes(filters.vendorName!.toLowerCase()));
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
