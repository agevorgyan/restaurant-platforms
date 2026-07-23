import { DomainEvent } from '@saas/core';

export class CustomerAddressAddedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly customerId: string, public readonly addressId: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class CustomerAddressUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly customerId: string, public readonly addressId: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class CustomerAddressRemovedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly customerId: string, public readonly addressId: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class DefaultAddressChangedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly customerId: string, public readonly addressId: string, public readonly type: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class AddressVerifiedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly customerId: string, public readonly addressId: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class AddressVerificationRevokedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly customerId: string, public readonly addressId: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class EmergencyContactAddedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly customerId: string, public readonly contactId: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class EmergencyContactRemovedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly customerId: string, public readonly contactId: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class CommunicationPreferenceUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly customerId: string) {}
  getAggregateId(): string { return this.customerId; }
}