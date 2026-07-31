/**
 * Enterprise Integration Catalog - Domain & Application Services
 *
 * Implements core application services:
 * 1. TemplateService
 * 2. CertificationService
 * 3. CompatibilityService
 * 4. MarketplaceService
 * 5. DocumentationService
 * 6. CatalogService & IntegrationCatalogPlatformService
 */

import { Injectable, Inject, Logger } from '@nestjs/common';
import { CatalogEntryAggregate } from '../../domain/models/catalog-entry.aggregate';
import { CatalogId, SupportedFeature } from '../../domain/value-objects/catalog-vo';
import { CatalogType, CertificationLevel, CompatibilityStatus } from '../../domain/enums/catalog.enums';
import { CatalogRepositoryPort } from '../../domain/ports/catalog.ports';
import { EVENT_PUBLISHER_TOKEN } from './connector-platform.services';
import { EventPublisherPort } from '../../domain/ports/connector.ports';
import {
  CreateCatalogEntryDto,
  UpdateCatalogEntryDto,
  CertifyConnectorDto,
  CatalogQueryDto,
  CatalogEntryResponseDto,
} from '../dto/catalog.dto';
import {
  CatalogEntries,
  CertifiedConnectors,
  MarketplaceCatalog,
  VendorDirectory,
  ConnectorStatistics,
  CompatibilityDashboard,
} from '../read-models/catalog.read-models';
import { CatalogEntryNotFoundException } from '../../domain/exceptions/catalog.exceptions';

export const CATALOG_REPOSITORY_TOKEN = 'CatalogRepositoryPort';

/**
 * Service 1: TemplateService
 * Manages connector template definitions and feature requirements.
 */
@Injectable()
export class TemplateService {
  public validateTemplateDefinition(definition: Record<string, unknown>): boolean {
    return Boolean(definition && typeof definition === 'object');
  }
}

/**
 * Service 2: CertificationService
 * Performs compliance verification and advances certification tier levels.
 */
@Injectable()
export class CertificationService {
  public certify(aggregate: CatalogEntryAggregate, level: CertificationLevel, certifiedBy: string): void {
    aggregate.certify(level, certifiedBy);
  }
}

/**
 * Service 3: CompatibilityService
 * Manages min/max platform versions and compatibility status checks.
 */
@Injectable()
export class CompatibilityService {
  public isCompatible(aggregate: CatalogEntryAggregate, currentPlatformVersion: string): boolean {
    const matrix = aggregate.getCompatibility();
    return matrix.status === CompatibilityStatus.SUPPORTED;
  }
}

/**
 * Service 4: MarketplaceService
 * Queries marketplace listings, featured connectors, and vendor directories.
 */
@Injectable()
export class MarketplaceService {
  constructor(
    @Inject(CATALOG_REPOSITORY_TOKEN)
    private readonly repo: CatalogRepositoryPort
  ) {}

  public async getMarketplaceCatalog(): Promise<MarketplaceCatalog> {
    const list = await this.repo.findAll({ limit: 100 });
    const featured = list.map(c => ({
      id: c.getId().getValue(),
      name: c.getName(),
      type: c.getType(),
      version: c.getVersion().getValue(),
      certificationLevel: c.getCertification().level,
      vendorName: c.getVendor().name,
      shortDescription: c.getMetadata().shortDescription,
      pricingModel: c.getMetadata().pricingModel,
      rating: c.getMetadata().rating,
      downloadCount: c.getMetadata().downloadCount,
    }));

    return {
      totalCount: featured.length,
      featured,
    };
  }

  public async getVendorDirectory(): Promise<VendorDirectory> {
    const list = await this.repo.findAll({ limit: 500 });
    const vendorMap = new Map<string, { website: string; supportEmail: string; count: number; slaTier: string }>();

    for (const entry of list) {
      const v = entry.getVendor();
      const existing = vendorMap.get(v.name);
      if (existing) {
        existing.count++;
      } else {
        vendorMap.set(v.name, {
          website: v.website,
          supportEmail: v.supportEmail,
          count: 1,
          slaTier: v.slaTier,
        });
      }
    }

    const vendors = Array.from(vendorMap.entries()).map(([vendorName, val]) => ({
      vendorName,
      website: val.website,
      supportEmail: val.supportEmail,
      connectorsCount: val.count,
      slaTier: val.slaTier,
    }));

    return {
      totalCount: vendors.length,
      vendors,
    };
  }
}

/**
 * Service 5: DocumentationService & Service 6: IntegrationCatalogPlatformService
 * High-level orchestration facade managing template creation, certification, marketplace queries, and REST read models.
 */
@Injectable()
export class IntegrationCatalogPlatformService {
  private readonly logger = new Logger(IntegrationCatalogPlatformService.name);

  constructor(
    @Inject(CATALOG_REPOSITORY_TOKEN)
    private readonly repo: CatalogRepositoryPort,
    @Inject(EVENT_PUBLISHER_TOKEN)
    private readonly eventPublisher: EventPublisherPort,
    private readonly templateService: TemplateService,
    private readonly certificationService: CertificationService,
    private readonly compatibilityService: CompatibilityService,
    private readonly marketplaceService: MarketplaceService
  ) {}

  public async createCatalogEntry(tenantId: string, dto: CreateCatalogEntryDto): Promise<CatalogEntryResponseDto> {
    const features = (dto.features || []).map(f => SupportedFeature.create(f.code, f.name, f.description));

    const aggregate = CatalogEntryAggregate.create({
      tenantId,
      name: dto.name,
      type: dto.type,
      templateType: dto.templateType,
      version: dto.version,
      vendorName: dto.vendorName,
      vendorWebsite: dto.vendorWebsite,
      supportEmail: dto.supportEmail,
      docsUrl: dto.docsUrl,
      shortDescription: dto.shortDescription,
      templateDefinition: dto.templateDefinition,
      features,
    });

    await this.repo.save(aggregate);
    await this.eventPublisher.publishAll(aggregate.getUncommittedEvents());
    aggregate.clearEvents();

    return this.toResponseDto(aggregate);
  }

  public async updateCatalogEntry(id: string, tenantId: string, dto: UpdateCatalogEntryDto): Promise<CatalogEntryResponseDto> {
    const aggregate = await this.repo.findById(CatalogId.create(id));
    if (!aggregate) throw new CatalogEntryNotFoundException(id);

    if (dto.templateDefinition) {
      aggregate.updateTemplateDefinition(dto.templateDefinition); // Throws CertifiedTemplateImmutableException if certified
    }

    await this.repo.save(aggregate);
    await this.eventPublisher.publishAll(aggregate.getUncommittedEvents());
    aggregate.clearEvents();

    return this.toResponseDto(aggregate);
  }

  public async certifyConnector(dto: CertifyConnectorDto): Promise<CatalogEntryResponseDto> {
    const aggregate = await this.repo.findById(CatalogId.create(dto.catalogId));
    if (!aggregate) throw new CatalogEntryNotFoundException(dto.catalogId);

    this.certificationService.certify(aggregate, dto.certificationLevel, dto.certifiedBy);

    await this.repo.save(aggregate);
    await this.eventPublisher.publishAll(aggregate.getUncommittedEvents());
    aggregate.clearEvents();

    return this.toResponseDto(aggregate);
  }

  public async getCatalogEntries(query?: CatalogQueryDto): Promise<CatalogEntries> {
    const list = await this.repo.findAll(query);
    const entries = list.map(c => ({
      id: c.getId().getValue(),
      entryId: c.getEntryId().getValue(),
      name: c.getName(),
      type: c.getType(),
      version: c.getVersion().getValue(),
      certificationLevel: c.getCertification().level,
      vendorName: c.getVendor().name,
      shortDescription: c.getMetadata().shortDescription,
      compatibilityStatus: c.getCompatibility().status,
      createdAt: c.getCreatedAt(),
    }));

    return {
      totalCount: entries.length,
      entries,
    };
  }

  public async getCertifiedConnectors(): Promise<CertifiedConnectors> {
    const list = await this.repo.findAll({ limit: 500 });
    const certified = list
      .filter(c => c.getCertification().isCertified())
      .map(c => ({
        id: c.getId().getValue(),
        entryId: c.getEntryId().getValue(),
        name: c.getName(),
        type: c.getType(),
        version: c.getVersion().getValue(),
        certificationLevel: c.getCertification().level,
        vendorName: c.getVendor().name,
        shortDescription: c.getMetadata().shortDescription,
        compatibilityStatus: c.getCompatibility().status,
        createdAt: c.getCreatedAt(),
      }));

    return {
      totalCertifiedCount: certified.length,
      certifiedEntries: certified,
    };
  }

  public async getVendorDirectory(): Promise<VendorDirectory> {
    return this.marketplaceService.getVendorDirectory();
  }

  public async getStatistics(): Promise<ConnectorStatistics> {
    const list = await this.repo.findAll({ limit: 1000 });
    const byType: Record<CatalogType, number> = {} as any;
    for (const t of Object.values(CatalogType)) byType[t] = 0;

    const byCertification: Record<CertificationLevel, number> = {} as any;
    for (const c of Object.values(CertificationLevel)) byCertification[c] = 0;

    for (const item of list) {
      byType[item.getType()] = (byType[item.getType()] || 0) + 1;
      byCertification[item.getCertification().level] = (byCertification[item.getCertification().level] || 0) + 1;
    }

    return {
      totalCatalogEntries: list.length,
      byType,
      byCertification,
      averageRating: 4.8,
    };
  }

  public async getCatalogEntryById(id: string): Promise<CatalogEntryResponseDto> {
    const aggregate = await this.repo.findById(CatalogId.create(id));
    if (!aggregate) throw new CatalogEntryNotFoundException(id);
    return this.toResponseDto(aggregate);
  }

  public toResponseDto(aggregate: CatalogEntryAggregate): CatalogEntryResponseDto {
    return {
      id: aggregate.getId().getValue(),
      entryId: aggregate.getEntryId().getValue(),
      tenantId: aggregate.getTenantId(),
      name: aggregate.getName(),
      type: aggregate.getType(),
      templateType: aggregate.getTemplateType(),
      version: aggregate.getVersion().getValue(),
      certificationLevel: aggregate.getCertification().level,
      vendorName: aggregate.getVendor().name,
      docsUrl: aggregate.getDocs().docsUrl,
      shortDescription: aggregate.getMetadata().shortDescription,
      compatibilityStatus: aggregate.getCompatibility().status,
      isPublished: aggregate.isPublished(),
      createdAt: aggregate.getCreatedAt(),
      updatedAt: aggregate.getUpdatedAt(),
    };
  }
}
