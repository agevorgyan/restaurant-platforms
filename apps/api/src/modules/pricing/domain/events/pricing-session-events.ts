import { DomainEvent } from '@saas/core';
import { PricingSessionId } from '../value-objects/pricing-session-id.value-object';
import { PricingVersion } from '../value-objects/pricing-version.value-object';

export class PricingSessionCreated implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly sessionId: PricingSessionId) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.sessionId.value; }
}

export class PricingCalculated implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(
    public readonly sessionId: PricingSessionId,
    public readonly version: PricingVersion
  ) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.sessionId.value; }
}

export class PricingRecalculated implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(
    public readonly sessionId: PricingSessionId,
    public readonly version: PricingVersion
  ) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.sessionId.value; }
}

export class PricingSnapshotGenerated implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(
    public readonly sessionId: PricingSessionId,
    public readonly snapshotHash: string
  ) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.sessionId.value; }
}

export class PricingSessionClosed implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly sessionId: PricingSessionId) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.sessionId.value; }
}
