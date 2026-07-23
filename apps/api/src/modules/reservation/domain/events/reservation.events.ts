import { DomainEvent } from '@saas/core';

export class ReservationCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string, public readonly branchId: string) {}
  getAggregateId(): string { return this.reservationId; }
}

export class ReservationConfirmedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string) {}
  getAggregateId(): string { return this.reservationId; }
}

export class ReservationCancelledEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string, public readonly reason: string) {}
  getAggregateId(): string { return this.reservationId; }
}

export class ReservationCheckedInEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string) {}
  getAggregateId(): string { return this.reservationId; }
}

export class ReservationCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string) {}
  getAggregateId(): string { return this.reservationId; }
}

export class ReservationMarkedNoShowEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string) {}
  getAggregateId(): string { return this.reservationId; }
}

export class ReservationRescheduledEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string, public readonly newTime: string) {}
  getAggregateId(): string { return this.reservationId; }
}

export class ReservationGuestUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string) {}
  getAggregateId(): string { return this.reservationId; }
}

export class ReservationAssignmentUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string) {}
  getAggregateId(): string { return this.reservationId; }
}

export class ReservationNoteAddedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string, public readonly author: string) {}
  getAggregateId(): string { return this.reservationId; }
}