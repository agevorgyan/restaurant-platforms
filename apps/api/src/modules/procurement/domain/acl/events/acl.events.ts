import { DomainEvent } from '@saas/core';

export interface AclIntegrationEvent extends DomainEvent {
  correlationId: string;
  causationId: string;
  version: number;
  timestamp: Date;
  producerId: string;
  schemaVersion: string;
}

export class ProcurementIntegrationStartedEvent implements AclIntegrationEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly timestamp: Date = new Date();
  public readonly version: number = 1;
  constructor(
    public readonly eventId: string,
    public readonly correlationId: string,
    public readonly causationId: string,
    public readonly producerId: string,
    public readonly schemaVersion: string
  ) {}
  public getAggregateId(): string { return this.eventId; }
}

export class ProcurementIntegrationCompletedEvent implements AclIntegrationEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly timestamp: Date = new Date();
  public readonly version: number = 1;
  constructor(
    public readonly eventId: string,
    public readonly correlationId: string,
    public readonly causationId: string,
    public readonly producerId: string,
    public readonly schemaVersion: string
  ) {}
  public getAggregateId(): string { return this.eventId; }
}

export class ProcurementIntegrationFailedEvent implements AclIntegrationEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly timestamp: Date = new Date();
  public readonly version: number = 1;
  constructor(
    public readonly eventId: string,
    public readonly correlationId: string,
    public readonly causationId: string,
    public readonly producerId: string,
    public readonly schemaVersion: string,
    public readonly reason: string
  ) {}
  public getAggregateId(): string { return this.eventId; }
}

export class ContractRejectedEvent implements AclIntegrationEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly timestamp: Date = new Date();
  public readonly version: number = 1;
  constructor(
    public readonly eventId: string,
    public readonly correlationId: string,
    public readonly causationId: string,
    public readonly producerId: string,
    public readonly schemaVersion: string,
    public readonly rejectionReason: string
  ) {}
  public getAggregateId(): string { return this.eventId; }
}

export class VersionMismatchDetectedEvent implements AclIntegrationEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly timestamp: Date = new Date();
  public readonly version: number = 1;
  constructor(
    public readonly eventId: string,
    public readonly correlationId: string,
    public readonly causationId: string,
    public readonly producerId: string,
    public readonly schemaVersion: string,
    public readonly expectedVersion: string
  ) {}
  public getAggregateId(): string { return this.eventId; }
}

export class DuplicateEventIgnoredEvent implements AclIntegrationEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly timestamp: Date = new Date();
  public readonly version: number = 1;
  constructor(
    public readonly eventId: string,
    public readonly correlationId: string,
    public readonly causationId: string,
    public readonly producerId: string,
    public readonly schemaVersion: string
  ) {}
  public getAggregateId(): string { return this.eventId; }
}

export class PoisonMessageDetectedEvent implements AclIntegrationEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly timestamp: Date = new Date();
  public readonly version: number = 1;
  constructor(
    public readonly messageId: string,
    public readonly correlationId: string,
    public readonly causationId: string,
    public readonly producerId: string,
    public readonly schemaVersion: string,
    public readonly errorDetails: string
  ) {}
  public getAggregateId(): string { return this.messageId; }
}