import { DomainEvent } from '@saas/core';

export class ReservationCustomerIntegrationStartedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly reservationId: string) {}
  getAggregateId(): string { return this.reservationId; }
}

export class ReservationCustomerIntegrationCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly reservationId: string) {}
  getAggregateId(): string { return this.reservationId; }
}

export class ReservationCustomerIntegrationFailedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly reservationId: string, public readonly reason: string) {}
  getAggregateId(): string { return this.reservationId; }
}

export class CustomerEligibilityEvaluatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly isEligible: boolean) {}
  getAggregateId(): string { return this.correlationId; }
}

export class GuestResolvedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly guestId: string) {}
  getAggregateId(): string { return this.correlationId; }
}