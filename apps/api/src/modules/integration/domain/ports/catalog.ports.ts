/**
 * Enterprise Integration Catalog - Hexagonal Domain Ports
 */

import { CatalogEntryAggregate } from '../models/catalog-entry.aggregate';
import { CatalogId } from '../value-objects/catalog-vo';
import { CatalogType, CertificationLevel } from '../enums/catalog.enums';

export interface CatalogRepositoryPort {
  save(entry: CatalogEntryAggregate): Promise<void>;
  findById(id: CatalogId): Promise<CatalogEntryAggregate | null>;
  findAll(filters?: {
    tenantId?: string;
    type?: CatalogType;
    certificationLevel?: CertificationLevel;
    vendorName?: string;
    limit?: number;
    offset?: number;
  }): Promise<CatalogEntryAggregate[]>;
}

export interface CertificationPort {
  verifyCompliance(entry: CatalogEntryAggregate): Promise<boolean>;
}

export interface MarketplaceRegistryPort {
  findTopFeatured(limit?: number): Promise<CatalogEntryAggregate[]>;
}
