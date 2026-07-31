/**
 * Enterprise Integration Catalog - Catalog Entry Aggregate Root
 *
 * Manages connector template definitions, certification level lifecycle,
 * compatibility matrices, and marketplace metadata.
 * STRICT RULE: Templates are IMMUTABLE once certified at CERTIFIED or ENTERPRISE level.
 */

import { CatalogType, CertificationLevel, TemplateType, CompatibilityStatus } from '../enums/catalog.enums';
import {
  CatalogId,
  CatalogEntryId,
  ConnectorVersionVO,
  CertificationLevelVO,
  SupportedFeature,
  VendorInformation,
  DocumentationReference,
  MarketplaceMetadata,
  CompatibilityMatrix,
} from '../value-objects/catalog-vo';
import { BaseDomainEvent } from '../events/connector.events';
import {
  CatalogEntryCreatedEvent,
  ConnectorCertifiedEvent,
  ConnectorDeprecatedEvent,
  ConnectorPublishedEvent,
  CompatibilityUpdatedEvent,
  MarketplaceMetadataUpdatedEvent,
} from '../events/catalog.events';
import { CertifiedTemplateImmutableException, InvalidTemplateException } from '../exceptions/catalog.exceptions';

export interface CatalogEntryProps {
  id: CatalogId;
  entryId: CatalogEntryId;
  tenantId: string;
  name: string;
  type: CatalogType;
  templateType: TemplateType;
  version: ConnectorVersionVO;
  certification: CertificationLevelVO;
  vendor: VendorInformation;
  docs: DocumentationReference;
  metadata: MarketplaceMetadata;
  compatibility: CompatibilityMatrix;
  features: SupportedFeature[];
  templateDefinition: Record<string, unknown>;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class CatalogEntryAggregate {
  private domainEvents: BaseDomainEvent[] = [];

  private constructor(private props: CatalogEntryProps) {}

  public static create(params: {
    id?: CatalogId;
    entryId?: CatalogEntryId;
    tenantId?: string;
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
    features?: SupportedFeature[];
  }): CatalogEntryAggregate {
    const id = params.id || CatalogId.generate();
    const entryId = params.entryId || CatalogEntryId.create(params.name.toLowerCase().replace(/[^a-z0-9]/g, '-'));
    const tenantId = params.tenantId || 'tenant-default';
    const type = params.type || CatalogType.CUSTOM;
    const templateType = params.templateType || TemplateType.CONNECTOR_TEMPLATE;
    const version = ConnectorVersionVO.create(params.version || '1.0.0');

    const vendor = VendorInformation.create(params.vendorName, params.vendorWebsite, params.supportEmail);
    const docs = DocumentationReference.create(params.docsUrl);
    const metadata = MarketplaceMetadata.create({ shortDescription: params.shortDescription });
    const compatibility = CompatibilityMatrix.default();

    const now = new Date();
    const aggregate = new CatalogEntryAggregate({
      id,
      entryId,
      tenantId,
      name: params.name,
      type,
      templateType,
      version,
      certification: CertificationLevelVO.default(), // DRAFT
      vendor,
      docs,
      metadata,
      compatibility,
      features: params.features || [],
      templateDefinition: params.templateDefinition || {},
      isPublished: false,
      createdAt: now,
      updatedAt: now,
    });

    aggregate.addDomainEvent(
      new CatalogEntryCreatedEvent(id.getValue(), tenantId, params.name, type, version.getValue(), now)
    );

    return aggregate;
  }

  // --- Getters ---
  public getId(): CatalogId { return this.props.id; }
  public getEntryId(): CatalogEntryId { return this.props.entryId; }
  public getTenantId(): string { return this.props.tenantId; }
  public getName(): string { return this.props.name; }
  public getType(): CatalogType { return this.props.type; }
  public getTemplateType(): TemplateType { return this.props.templateType; }
  public getVersion(): ConnectorVersionVO { return this.props.version; }
  public getCertification(): CertificationLevelVO { return this.props.certification; }
  public getVendor(): VendorInformation { return this.props.vendor; }
  public getDocs(): DocumentationReference { return this.props.docs; }
  public getMetadata(): MarketplaceMetadata { return this.props.metadata; }
  public getCompatibility(): CompatibilityMatrix { return this.props.compatibility; }
  public getFeatures(): SupportedFeature[] { return [...this.props.features]; }
  public getTemplateDefinition(): Record<string, unknown> { return { ...this.props.templateDefinition }; }
  public isPublished(): boolean { return this.props.isPublished; }
  public getCreatedAt(): Date { return this.props.createdAt; }
  public getUpdatedAt(): Date { return this.props.updatedAt; }

  public getUncommittedEvents(): BaseDomainEvent[] { return [...this.domainEvents]; }
  public clearEvents(): void { this.domainEvents = []; }

  private addDomainEvent(event: BaseDomainEvent): void { this.domainEvents.push(event); }

  public updateTemplateDefinition(definition: Record<string, unknown>): void {
    if (this.props.certification.isCertified()) {
      throw new CertifiedTemplateImmutableException(
        this.getId().getValue(),
        this.props.certification.level
      );
    }
    this.props.templateDefinition = { ...definition };
    this.props.updatedAt = new Date();
  }

  public certify(level: CertificationLevel, certifiedBy: string): void {
    const now = new Date();
    this.props.certification = CertificationLevelVO.create(level);
    this.props.updatedAt = now;

    this.addDomainEvent(
      new ConnectorCertifiedEvent(this.getId().getValue(), this.getTenantId(), level, certifiedBy, now)
    );
  }

  public publish(): void {
    const now = new Date();
    this.props.isPublished = true;
    this.props.updatedAt = now;

    this.addDomainEvent(
      new ConnectorPublishedEvent(this.getId().getValue(), this.getTenantId(), this.getVersion().getValue(), now)
    );
  }

  public updateCompatibility(minPlatformVersion: string, status: CompatibilityStatus): void {
    const now = new Date();
    this.props.compatibility = CompatibilityMatrix.create(minPlatformVersion, status);
    this.props.updatedAt = now;

    this.addDomainEvent(
      new CompatibilityUpdatedEvent(this.getId().getValue(), this.getTenantId(), minPlatformVersion, status, now)
    );
  }

  public updateMarketplaceMetadata(metadata: MarketplaceMetadata): void {
    const now = new Date();
    this.props.metadata = metadata;
    this.props.updatedAt = now;

    this.addDomainEvent(
      new MarketplaceMetadataUpdatedEvent(this.getId().getValue(), this.getTenantId(), metadata.pricingModel, now)
    );
  }

  public deprecate(reason: string): void {
    const now = new Date();
    this.props.compatibility = CompatibilityMatrix.create('1.0.0', CompatibilityStatus.DEPRECATED);
    this.props.updatedAt = now;

    this.addDomainEvent(
      new ConnectorDeprecatedEvent(this.getId().getValue(), this.getTenantId(), reason, now)
    );
  }
}
