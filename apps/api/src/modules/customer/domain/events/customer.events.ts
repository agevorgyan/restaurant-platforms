import { DomainEvent } from '@saas/core';

export class CustomerCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly customerId: string, public readonly type: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class CustomerRegisteredEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly customerId: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class CustomerVerifiedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly customerId: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class CustomerActivatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly customerId: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class CustomerSuspendedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly customerId: string, public readonly reason: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class CustomerArchivedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly customerId: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class CustomerProfileUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly customerId: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class CustomerContactUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly customerId: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class CustomerPreferenceUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly customerId: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class CustomerConsentGrantedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly customerId: string, public readonly type: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class CustomerConsentRevokedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly customerId: string, public readonly type: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class ExternalIdentifierLinkedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly customerId: string, public readonly provider: string) {}
  getAggregateId(): string { return this.customerId; }
}