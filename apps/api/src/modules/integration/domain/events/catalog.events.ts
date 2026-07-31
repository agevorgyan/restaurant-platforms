/**
 * Enterprise Integration Catalog - Domain Events
 */

import { randomUUID } from 'crypto';
import { BaseDomainEvent } from './connector.events';
import { CatalogType, CertificationLevel, CompatibilityStatus } from '../enums/catalog.enums';

export class CatalogEntryCreatedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'CatalogEntryCreated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly type: CatalogType,
    public readonly version: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ConnectorCertifiedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ConnectorCertified';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly certificationLevel: CertificationLevel,
    public readonly certifiedBy: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ConnectorDeprecatedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ConnectorDeprecated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly reason: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ConnectorPublishedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ConnectorPublished';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly version: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class CompatibilityUpdatedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'CompatibilityUpdated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly minPlatformVersion: string,
    public readonly status: CompatibilityStatus,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class MarketplaceMetadataUpdatedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'MarketplaceMetadataUpdated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly pricingModel: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export type CatalogDomainEvent =
  | CatalogEntryCreatedEvent
  | ConnectorCertifiedEvent
  | ConnectorDeprecatedEvent
  | ConnectorPublishedEvent
  | CompatibilityUpdatedEvent
  | MarketplaceMetadataUpdatedEvent;
