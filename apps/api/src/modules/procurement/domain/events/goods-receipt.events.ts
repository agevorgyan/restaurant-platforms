import { DomainEvent } from '@saas/core';

export class GoodsReceiptCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly goodsReceiptId: string) {}
  public getAggregateId(): string { return this.goodsReceiptId; }
}

export class GoodsReceiptStartedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly goodsReceiptId: string) {}
  public getAggregateId(): string { return this.goodsReceiptId; }
}

export class GoodsReceiptCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly goodsReceiptId: string) {}
  public getAggregateId(): string { return this.goodsReceiptId; }
}

export class GoodsReceiptRejectedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly goodsReceiptId: string) {}
  public getAggregateId(): string { return this.goodsReceiptId; }
}

export class GoodsReceiptCancelledEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly goodsReceiptId: string) {}
  public getAggregateId(): string { return this.goodsReceiptId; }
}

export class GoodsReceiptLineAddedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly goodsReceiptId: string, public readonly lineId: string) {}
  public getAggregateId(): string { return this.goodsReceiptId; }
}

export class GoodsReceiptInspectionCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly goodsReceiptId: string, public readonly inspectionId: string) {}
  public getAggregateId(): string { return this.goodsReceiptId; }
}

export class BatchRecordedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly goodsReceiptId: string, public readonly batchId: string) {}
  public getAggregateId(): string { return this.goodsReceiptId; }
}

export class SerialNumbersAssignedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly goodsReceiptId: string, public readonly lineId: string) {}
  public getAggregateId(): string { return this.goodsReceiptId; }
}

export class DamageReportedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly goodsReceiptId: string, public readonly damageId: string) {}
  public getAggregateId(): string { return this.goodsReceiptId; }
}