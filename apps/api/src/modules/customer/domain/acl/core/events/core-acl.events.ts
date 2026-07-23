import { DomainEvent } from '@saas/core';

export class CustomerContractTranslatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly contractType: string) {}
  getAggregateId(): string { return this.correlationId; }
}

export class CustomerContractRejectedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly reason: string) {}
  getAggregateId(): string { return this.correlationId; }
}

export class CustomerVersionNegotiatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly version: string) {}
  getAggregateId(): string { return this.correlationId; }
}

export class CustomerTranslationFailedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly reason: string) {}
  getAggregateId(): string { return this.correlationId; }
}

export class ExternalReferenceResolvedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly externalId: string) {}
  getAggregateId(): string { return this.correlationId; }
}

export class ACLValidationCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string) {}
  getAggregateId(): string { return this.correlationId; }
}