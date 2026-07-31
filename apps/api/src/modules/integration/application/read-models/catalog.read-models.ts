/**
 * Enterprise Integration Catalog - CQRS Read Models
 */

import { CatalogType, CertificationLevel, CompatibilityStatus } from '../../domain/enums/catalog.enums';

export interface CatalogEntryListItem {
  id: string;
  entryId: string;
  name: string;
  type: CatalogType;
  version: string;
  certificationLevel: CertificationLevel;
  vendorName: string;
  shortDescription: string;
  compatibilityStatus: CompatibilityStatus;
  createdAt: Date;
}

export interface CatalogEntries {
  totalCount: number;
  entries: CatalogEntryListItem[];
}

export interface CertifiedConnectors {
  totalCertifiedCount: number;
  certifiedEntries: CatalogEntryListItem[];
}

export interface CompatibilityDashboard {
  supportedCount: number;
  deprecatedCount: number;
  experimentalCount: number;
  unsupportedCount: number;
  entries: {
    name: string;
    version: string;
    status: CompatibilityStatus;
    minPlatformVersion: string;
  }[];
}

export interface MarketplaceCatalogItem {
  id: string;
  name: string;
  type: CatalogType;
  version: string;
  certificationLevel: CertificationLevel;
  vendorName: string;
  shortDescription: string;
  pricingModel: string;
  rating: number;
  downloadCount: number;
}

export interface MarketplaceCatalog {
  totalCount: number;
  featured: MarketplaceCatalogItem[];
}

export interface VendorDirectoryItem {
  vendorName: string;
  website: string;
  supportEmail: string;
  connectorsCount: number;
  slaTier: string;
}

export interface VendorDirectory {
  totalCount: number;
  vendors: VendorDirectoryItem[];
}

export interface ConnectorStatistics {
  totalCatalogEntries: number;
  byType: Record<CatalogType, number>;
  byCertification: Record<CertificationLevel, number>;
  averageRating: number;
}
