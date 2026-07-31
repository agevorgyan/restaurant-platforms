/**
 * Enterprise Integration Catalog - Application DTOs
 */

import { CatalogType, TemplateType, CertificationLevel, CompatibilityStatus } from '../../domain/enums/catalog.enums';

export interface CreateCatalogEntryDto {
  name: string;
  type?: CatalogType;
  templateType?: TemplateType;
  version?: string;
  vendorName: string;
  vendorWebsite: string;
  supportEmail: string;
  docsUrl: string;
  shortDescription: string;
  templateDefinition?: Record<string, unknown>;
  features?: { code: string; name: string; description?: string }[];
}

export interface UpdateCatalogEntryDto {
  shortDescription?: string;
  detailedMarkdown?: string;
  tags?: string[];
  categories?: string[];
  templateDefinition?: Record<string, unknown>;
}

export interface CertifyConnectorDto {
  catalogId: string;
  certificationLevel: CertificationLevel;
  certifiedBy: string;
}

export interface CatalogQueryDto {
  tenantId?: string;
  type?: CatalogType;
  certificationLevel?: CertificationLevel;
  vendorName?: string;
  limit?: number;
  offset?: number;
}

export interface CatalogEntryResponseDto {
  id: string;
  entryId: string;
  tenantId: string;
  name: string;
  type: CatalogType;
  templateType: TemplateType;
  version: string;
  certificationLevel: CertificationLevel;
  vendorName: string;
  docsUrl: string;
  shortDescription: string;
  compatibilityStatus: CompatibilityStatus;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}
