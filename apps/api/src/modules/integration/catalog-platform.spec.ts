/**
 * Enterprise Integration Catalog - Comprehensive Test Suite
 *
 * Tests Domain Value Objects, Certification Level Lifecycle, Template Immutability Rules,
 * Marketplace Metadata, Vendor Directory, and Application Services.
 */

import {
  CatalogId,
  ConnectorVersionVO,
  CertificationLevelVO,
  SupportedFeature,
  VendorInformation,
} from './domain/value-objects/catalog-vo';
import { CatalogType, CertificationLevel, TemplateType } from './domain/enums/catalog.enums';
import {
  CertifiedTemplateImmutableException,
  InvalidTemplateException,
  CatalogEntryNotFoundException,
} from './domain/exceptions/catalog.exceptions';
import { CatalogEntryAggregate } from './domain/models/catalog-entry.aggregate';
import { InMemoryCatalogRepository } from './infrastructure/repositories/in-memory-catalog.repository';
import { NestEventPublisherAdapter } from './infrastructure/adapters/connector.adapters';
import {
  TemplateService,
  CertificationService,
  CompatibilityService,
  MarketplaceService,
  IntegrationCatalogPlatformService,
} from './application/services/catalog-platform.services';

describe('Enterprise Integration Catalog', () => {
  describe('Value Objects & Enums', () => {
    it('should create and validate ConnectorVersionVO and SupportedFeature', () => {
      const ver = ConnectorVersionVO.create('2.1.0');
      expect(ver.getValue()).toBe('2.1.0');

      const feature = SupportedFeature.create('REFUNDS', 'Refund Processing', 'Supports full/partial refunds');
      expect(feature.code).toBe('REFUNDS');
      expect(feature.name).toBe('Refund Processing');

      expect(() => ConnectorVersionVO.create('invalid_semver')).toThrow(InvalidTemplateException);
    });

    it('should create VendorInformation with SLA tier', () => {
      const vendor = VendorInformation.create('Stripe Inc.', 'https://stripe.com', 'support@stripe.com', 'PLATINUM');
      expect(vendor.name).toBe('Stripe Inc.');
      expect(vendor.slaTier).toBe('PLATINUM');
    });
  });

  describe('CatalogEntryAggregate Root Immutability', () => {
    it('should create aggregate in DRAFT certification level', () => {
      const aggregate = CatalogEntryAggregate.create({
        name: 'Toast POS Connector Template',
        type: CatalogType.POS,
        templateType: TemplateType.CONNECTOR_TEMPLATE,
        version: '1.0.0',
        vendorName: 'Toast Inc.',
        vendorWebsite: 'https://toasttab.com',
        supportEmail: 'support@toasttab.com',
        docsUrl: 'https://docs.toasttab.com',
        shortDescription: 'Official Toast POS integration connector template',
      });

      expect(aggregate.getCertification().level).toBe(CertificationLevel.DRAFT);
      expect(aggregate.getCertification().isCertified()).toBe(false);

      // Updates allowed in DRAFT level
      expect(() => aggregate.updateTemplateDefinition({ endpoint: '/v1/orders' })).not.toThrow();
      expect(aggregate.getTemplateDefinition().endpoint).toBe('/v1/orders');
    });

    it('should enforce immutability when certified at CERTIFIED level', () => {
      const aggregate = CatalogEntryAggregate.create({
        name: 'Stripe Payment Template',
        type: CatalogType.PAYMENT,
        vendorName: 'Stripe',
        vendorWebsite: 'https://stripe.com',
        supportEmail: 'support@stripe.com',
        docsUrl: 'https://stripe.com/docs',
        shortDescription: 'Stripe payments template',
      });

      aggregate.certify(CertificationLevel.CERTIFIED, 'qa-certification-team');
      expect(aggregate.getCertification().level).toBe(CertificationLevel.CERTIFIED);
      expect(aggregate.getCertification().isCertified()).toBe(true);

      // Attempting to modify template definition throws CertifiedTemplateImmutableException
      expect(() => aggregate.updateTemplateDefinition({ tampered: true })).toThrow(CertifiedTemplateImmutableException);
    });
  });

  describe('Services & Catalog Platform Facade', () => {
    let repo: InMemoryCatalogRepository;
    let publisherAdapter: NestEventPublisherAdapter;
    let templateService: TemplateService;
    let certificationService: CertificationService;
    let compatibilityService: CompatibilityService;
    let marketplaceService: MarketplaceService;
    let catalogPlatformService: IntegrationCatalogPlatformService;

    beforeEach(() => {
      repo = new InMemoryCatalogRepository();
      publisherAdapter = new NestEventPublisherAdapter();
      templateService = new TemplateService();
      certificationService = new CertificationService();
      compatibilityService = new CompatibilityService();
      marketplaceService = new MarketplaceService(repo);

      catalogPlatformService = new IntegrationCatalogPlatformService(
        repo,
        publisherAdapter,
        templateService,
        certificationService,
        compatibilityService,
        marketplaceService
      );
    });

    it('should create, certify, and query certified catalog entries', async () => {
      const entry = await catalogPlatformService.createCatalogEntry('tenant-main', {
        name: 'UberEats Delivery Connector',
        type: CatalogType.DELIVERY,
        templateType: TemplateType.CONNECTOR_TEMPLATE,
        version: '1.0.0',
        vendorName: 'Uber Technologies',
        vendorWebsite: 'https://ubereats.com',
        supportEmail: 'integrations@ubereats.com',
        docsUrl: 'https://developer.uber.com/docs/eats',
        shortDescription: 'UberEats restaurant order sync connector',
        templateDefinition: { authType: 'OAuth2' },
      });

      expect(entry.certificationLevel).toBe(CertificationLevel.DRAFT);

      // Certify connector
      const certified = await catalogPlatformService.certifyConnector({
        catalogId: entry.id,
        certificationLevel: CertificationLevel.CERTIFIED,
        certifiedBy: 'enterprise-arch-board',
      });

      expect(certified.certificationLevel).toBe(CertificationLevel.CERTIFIED);

      // Query certified connectors
      const certifiedList = await catalogPlatformService.getCertifiedConnectors();
      expect(certifiedList.totalCertifiedCount).toBe(1);
      expect(certifiedList.certifiedEntries[0].name).toBe('UberEats Delivery Connector');
    });

    it('should query vendor directory and connector statistics', async () => {
      await catalogPlatformService.createCatalogEntry('tenant-main', {
        name: 'HubSpot CRM Template',
        type: CatalogType.CRM,
        vendorName: 'HubSpot Inc.',
        vendorWebsite: 'https://hubspot.com',
        supportEmail: 'support@hubspot.com',
        docsUrl: 'https://developers.hubspot.com',
        shortDescription: 'CRM sync connector',
      });

      const directory = await catalogPlatformService.getVendorDirectory();
      expect(directory.totalCount).toBe(1);
      expect(directory.vendors[0].vendorName).toBe('HubSpot Inc.');

      const stats = await catalogPlatformService.getStatistics();
      expect(stats.totalCatalogEntries).toBe(1);
      expect(stats.byType[CatalogType.CRM]).toBe(1);
    });
  });
});
