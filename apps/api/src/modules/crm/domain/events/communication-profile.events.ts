import { CustomerDomainEvent } from './core/customer-domain-event.interface';
import { CustomerEventMetadata } from './value-objects/customer-event-metadata.value-object';
import { CustomerEventVersion } from './value-objects/customer-event-version.value-object';

function createMetadata(eventName: string, aggregateId: string, aggregateType: string, restaurantId: string) {
  return new CustomerEventMetadata(
    Math.random().toString(36).substring(2, 15),
    eventName,
    new CustomerEventVersion('1.0.0'),
    aggregateId,
    aggregateType,
    restaurantId,
    new Date()
  );
}

export class CommunicationProfileCreatedEvent implements CustomerDomainEvent<{ profileId: string; customerId: string }> {
  public readonly eventName = 'CommunicationProfileCreated';
  public readonly occurredOn: Date;
  public readonly payload: { profileId: string; customerId: string };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrProfileId: CustomerEventMetadata | string, customerIdOrPayload?: string | any) {
    if (metadataOrProfileId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrProfileId;
      this.payload = customerIdOrPayload;
    } else {
      const profileId = metadataOrProfileId;
      const customerId = customerIdOrPayload;
      this.payload = { profileId, customerId };
      this.metadata = createMetadata(this.eventName, profileId, 'CommunicationProfile', 'N/A');
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class CommunicationConsentGrantedEvent implements CustomerDomainEvent<{ profileId: string; consentId: string; purpose: string }> {
  public readonly eventName = 'CommunicationConsentGranted';
  public readonly occurredOn: Date;
  public readonly payload: { profileId: string; consentId: string; purpose: string };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrProfileId: CustomerEventMetadata | string, consentIdOrPayload?: string | any, purpose?: string) {
    if (metadataOrProfileId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrProfileId;
      this.payload = consentIdOrPayload;
    } else {
      const profileId = metadataOrProfileId;
      const consentId = consentIdOrPayload;
      this.payload = { profileId, consentId, purpose: purpose! };
      this.metadata = createMetadata(this.eventName, profileId, 'CommunicationProfile', 'N/A');
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class CommunicationConsentRevokedEvent implements CustomerDomainEvent<{ profileId: string; consentId: string; purpose: string }> {
  public readonly eventName = 'CommunicationConsentRevoked';
  public readonly occurredOn: Date;
  public readonly payload: { profileId: string; consentId: string; purpose: string };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrProfileId: CustomerEventMetadata | string, consentIdOrPayload?: string | any, purpose?: string) {
    if (metadataOrProfileId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrProfileId;
      this.payload = consentIdOrPayload;
    } else {
      const profileId = metadataOrProfileId;
      const consentId = consentIdOrPayload;
      this.payload = { profileId, consentId, purpose: purpose! };
      this.metadata = createMetadata(this.eventName, profileId, 'CommunicationProfile', 'N/A');
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class PreferredChannelChangedEvent implements CustomerDomainEvent<{ profileId: string; channels: string[] }> {
  public readonly eventName = 'PreferredChannelChanged';
  public readonly occurredOn: Date;
  public readonly payload: { profileId: string; channels: string[] };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrProfileId: CustomerEventMetadata | string, channelsOrPayload?: string[] | any) {
    if (metadataOrProfileId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrProfileId;
      this.payload = channelsOrPayload;
    } else {
      const profileId = metadataOrProfileId;
      const channels = channelsOrPayload;
      this.payload = { profileId, channels };
      this.metadata = createMetadata(this.eventName, profileId, 'CommunicationProfile', 'N/A');
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}

export class CommunicationProfileArchivedEvent implements CustomerDomainEvent<{ profileId: string }> {
  public readonly eventName = 'CommunicationProfileArchived';
  public readonly occurredOn: Date;
  public readonly payload: { profileId: string };
  public readonly metadata: CustomerEventMetadata;

  constructor(metadataOrProfileId: CustomerEventMetadata | string, payload?: any) {
    if (metadataOrProfileId instanceof CustomerEventMetadata) {
      this.metadata = metadataOrProfileId;
      this.payload = payload;
    } else {
      const profileId = metadataOrProfileId;
      this.payload = { profileId };
      this.metadata = createMetadata(this.eventName, profileId, 'CommunicationProfile', 'N/A');
    }
    this.occurredOn = this.metadata.occurredAt;
  }
}
