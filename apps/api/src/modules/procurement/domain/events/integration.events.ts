import { DomainEvent } from '@saas/core';

export interface IntegrationEvent extends DomainEvent {
  correlationId: string;
  causationId: string;
  version: number;
}

// Outbound Integration Events
export class GoodsReceiptCompletedIntegrationEvent implements IntegrationEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly version: number = 1;
  constructor(
    public readonly goodsReceiptId: string,
    public readonly correlationId: string,
    public readonly causationId: string,
    public readonly payload: any
  ) {}
  public getAggregateId(): string { return this.goodsReceiptId; }
}

export class InventoryIncreaseRequestedEvent implements IntegrationEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly version: number = 1;
  constructor(
    public readonly transactionId: string,
    public readonly correlationId: string,
    public readonly causationId: string,
    public readonly payload: any
  ) {}
  public getAggregateId(): string { return this.transactionId; }
}

export class InventoryBatchRegistrationRequestedEvent implements IntegrationEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly version: number = 1;
  constructor(
    public readonly batchId: string,
    public readonly correlationId: string,
    public readonly causationId: string,
    public readonly payload: any
  ) {}
  public getAggregateId(): string { return this.batchId; }
}

export class InventorySerialRegistrationRequestedEvent implements IntegrationEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly version: number = 1;
  constructor(
    public readonly serialId: string,
    public readonly correlationId: string,
    public readonly causationId: string,
    public readonly payload: any
  ) {}
  public getAggregateId(): string { return this.serialId; }
}

export class InventoryInspectionCompletedIntegrationEvent implements IntegrationEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly version: number = 1;
  constructor(
    public readonly inspectionId: string,
    public readonly correlationId: string,
    public readonly causationId: string,
    public readonly payload: any
  ) {}
  public getAggregateId(): string { return this.inspectionId; }
}

export class InventorySynchronizationRequestedEvent implements IntegrationEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly version: number = 1;
  constructor(
    public readonly syncId: string,
    public readonly correlationId: string,
    public readonly causationId: string,
    public readonly payload: any
  ) {}
  public getAggregateId(): string { return this.syncId; }
}

// Inbound Integration Events
export class InventoryUpdatedEvent implements IntegrationEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly version: number = 1;
  constructor(
    public readonly inventoryId: string,
    public readonly correlationId: string,
    public readonly causationId: string,
    public readonly payload: any
  ) {}
  public getAggregateId(): string { return this.inventoryId; }
}

export class InventoryIncreaseCompletedEvent implements IntegrationEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly version: number = 1;
  constructor(
    public readonly transactionId: string,
    public readonly correlationId: string,
    public readonly causationId: string,
    public readonly payload: any
  ) {}
  public getAggregateId(): string { return this.transactionId; }
}

export class InventoryIncreaseRejectedEvent implements IntegrationEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly version: number = 1;
  constructor(
    public readonly transactionId: string,
    public readonly correlationId: string,
    public readonly causationId: string,
    public readonly reason: string
  ) {}
  public getAggregateId(): string { return this.transactionId; }
}

export class InventoryBatchRegisteredEvent implements IntegrationEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly version: number = 1;
  constructor(
    public readonly batchId: string,
    public readonly correlationId: string,
    public readonly causationId: string,
    public readonly payload: any
  ) {}
  public getAggregateId(): string { return this.batchId; }
}

export class InventorySerialRegisteredEvent implements IntegrationEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly version: number = 1;
  constructor(
    public readonly serialId: string,
    public readonly correlationId: string,
    public readonly causationId: string,
    public readonly payload: any
  ) {}
  public getAggregateId(): string { return this.serialId; }
}

export class InventorySynchronizationCompletedEvent implements IntegrationEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly version: number = 1;
  constructor(
    public readonly syncId: string,
    public readonly correlationId: string,
    public readonly causationId: string,
    public readonly payload: any
  ) {}
  public getAggregateId(): string { return this.syncId; }
}

export class InventorySynchronizationFailedEvent implements IntegrationEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly version: number = 1;
  constructor(
    public readonly syncId: string,
    public readonly correlationId: string,
    public readonly causationId: string,
    public readonly reason: string
  ) {}
  public getAggregateId(): string { return this.syncId; }
}

export class InventorySynchronizationStartedEvent implements IntegrationEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly version: number = 1;
  constructor(
    public readonly syncId: string,
    public readonly correlationId: string,
    public readonly causationId: string
  ) {}
  public getAggregateId(): string { return this.syncId; }
}

export class InventoryAcknowledgementReceivedEvent implements IntegrationEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly version: number = 1;
  constructor(
    public readonly ackId: string,
    public readonly correlationId: string,
    public readonly causationId: string
  ) {}
  public getAggregateId(): string { return this.ackId; }
}

export class InventoryUpdateRejectedEvent implements IntegrationEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly version: number = 1;
  constructor(
    public readonly rejectionId: string,
    public readonly correlationId: string,
    public readonly causationId: string,
    public readonly reason: string
  ) {}
  public getAggregateId(): string { return this.rejectionId; }
}