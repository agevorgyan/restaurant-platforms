import { DomainEvent } from '@saas/core';

export class PricingRequestedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly priceReference: string) {}
  getAggregateId(): string { return this.priceReference; }
}

export class PricingResolvedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly displayedPrice: string) {}
  getAggregateId(): string { return this.correlationId; }
}

export class PricingUnavailableEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly reason: string) {}
  getAggregateId(): string { return this.correlationId; }
}

export class PricingValidationFailedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly priceReference: string, public readonly reason: string) {}
  getAggregateId(): string { return this.priceReference; }
}

export class DisplayedPriceUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly priceReference: string, public readonly newDisplayedPrice: string) {}
  getAggregateId(): string { return this.priceReference; }
}