import { DomainEvent } from '@saas/core';

export class TableAssignmentEvaluatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string, public readonly approved: boolean) {}
  getAggregateId(): string { return this.reservationId; }
}

export class CapacityValidatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string, public readonly isSufficient: boolean) {}
  getAggregateId(): string { return this.reservationId; }
}

export class ReservationConflictDetectedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string, public readonly conflictReason: string) {}
  getAggregateId(): string { return this.reservationId; }
}

export class SeatingOptimizedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string) {}
  getAggregateId(): string { return this.reservationId; }
}

export class AssignmentRejectedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string, public readonly reasons: string[]) {}
  getAggregateId(): string { return this.reservationId; }
}

export class AssignmentApprovedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string, public readonly tables: string[]) {}
  getAggregateId(): string { return this.reservationId; }
}