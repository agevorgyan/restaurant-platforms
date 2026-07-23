import { DomainEvent } from '@saas/core';

export class ReservationContractTranslatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly contractType: string) {}
  getAggregateId(): string { return this.correlationId; }
}

export class ReservationContractRejectedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly reason: string) {}
  getAggregateId(): string { return this.correlationId; }
}

export class ReservationVersionNegotiatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly version: string) {}
  getAggregateId(): string { return this.correlationId; }
}

export class ReservationTranslationFailedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly reason: string) {}
  getAggregateId(): string { return this.correlationId; }
}

export class ReservationExternalReferenceResolvedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly externalId: string) {}
  getAggregateId(): string { return this.correlationId; }
}

export class ReservationACLValidationCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string) {}
  getAggregateId(): string { return this.correlationId; }
}