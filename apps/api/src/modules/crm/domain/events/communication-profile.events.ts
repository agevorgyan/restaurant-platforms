import { IDomainEvent } from './domain-event.interface';

export class CommunicationProfileCreatedEvent implements IDomainEvent {
  public readonly eventName = 'CommunicationProfileCreated';
  public readonly occurredOn = new Date();

  constructor(
    public readonly profileId: string,
    public readonly customerId: string
  ) {}
}

export class CommunicationConsentGrantedEvent implements IDomainEvent {
  public readonly eventName = 'CommunicationConsentGranted';
  public readonly occurredOn = new Date();

  constructor(
    public readonly profileId: string,
    public readonly consentId: string,
    public readonly purpose: string
  ) {}
}

export class CommunicationConsentRevokedEvent implements IDomainEvent {
  public readonly eventName = 'CommunicationConsentRevoked';
  public readonly occurredOn = new Date();

  constructor(
    public readonly profileId: string,
    public readonly consentId: string,
    public readonly purpose: string
  ) {}
}

export class PreferredChannelChangedEvent implements IDomainEvent {
  public readonly eventName = 'PreferredChannelChanged';
  public readonly occurredOn = new Date();

  constructor(
    public readonly profileId: string,
    public readonly channels: string[]
  ) {}
}

export class CommunicationProfileArchivedEvent implements IDomainEvent {
  public readonly eventName = 'CommunicationProfileArchived';
  public readonly occurredOn = new Date();

  constructor(
    public readonly profileId: string
  ) {}
}
