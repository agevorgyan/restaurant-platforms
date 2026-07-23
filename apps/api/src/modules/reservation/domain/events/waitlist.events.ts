import { DomainEvent } from '@saas/core';

export class WaitlistCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly waitlistId: string, public readonly branchId: string) {}
  getAggregateId(): string { return this.waitlistId; }
}

export class WaitlistEntryAddedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly waitlistId: string, public readonly entryId: string) {}
  getAggregateId(): string { return this.waitlistId; }
}

export class QueuePositionChangedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly waitlistId: string, public readonly entryId: string, public readonly newPosition: number) {}
  getAggregateId(): string { return this.waitlistId; }
}

export class PromotionStartedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly waitlistId: string, public readonly entryId: string) {}
  getAggregateId(): string { return this.waitlistId; }
}

export class PromotionSucceededEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly waitlistId: string, public readonly entryId: string) {}
  getAggregateId(): string { return this.waitlistId; }
}

export class PromotionExpiredEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly waitlistId: string, public readonly entryId: string) {}
  getAggregateId(): string { return this.waitlistId; }
}

export class PromotionRejectedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly waitlistId: string, public readonly entryId: string) {}
  getAggregateId(): string { return this.waitlistId; }
}

export class WaitlistEntryCancelledEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly waitlistId: string, public readonly entryId: string) {}
  getAggregateId(): string { return this.waitlistId; }
}

export class WaitlistCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly waitlistId: string) {}
  getAggregateId(): string { return this.waitlistId; }
}