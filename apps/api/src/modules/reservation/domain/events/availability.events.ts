import { DomainEvent } from '@saas/core';

export class AvailabilityEvaluationStartedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly branchId: string) {}
  getAggregateId(): string { return this.branchId; }
}

export class AvailabilityEvaluationCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly branchId: string, public readonly isAvailable: boolean) {}
  getAggregateId(): string { return this.branchId; }
}

export class AvailabilityRejectedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly branchId: string, public readonly reason: string) {}
  getAggregateId(): string { return this.branchId; }
}

export class BusinessHoursValidatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly branchId: string) {}
  getAggregateId(): string { return this.branchId; }
}

export class ReservationWindowValidatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly branchId: string) {}
  getAggregateId(): string { return this.branchId; }
}

export class CapacityForecastCalculatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly branchId: string, public readonly forecast: number) {}
  getAggregateId(): string { return this.branchId; }
}