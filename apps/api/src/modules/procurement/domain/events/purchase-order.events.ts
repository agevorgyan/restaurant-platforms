import { DomainEvent } from '@saas/core';

export class PurchaseOrderCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly purchaseOrderId: string) {}
  public getAggregateId(): string { return this.purchaseOrderId; }
}

export class PurchaseOrderSubmittedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly purchaseOrderId: string) {}
  public getAggregateId(): string { return this.purchaseOrderId; }
}

export class PurchaseOrderConfirmedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly purchaseOrderId: string) {}
  public getAggregateId(): string { return this.purchaseOrderId; }
}

export class PurchaseOrderCancelledEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly purchaseOrderId: string) {}
  public getAggregateId(): string { return this.purchaseOrderId; }
}

export class PurchaseOrderClosedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly purchaseOrderId: string) {}
  public getAggregateId(): string { return this.purchaseOrderId; }
}

export class PurchaseOrderLineAddedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly purchaseOrderId: string, public readonly lineId: string) {}
  public getAggregateId(): string { return this.purchaseOrderId; }
}

export class PurchaseOrderLineRemovedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly purchaseOrderId: string, public readonly lineId: string) {}
  public getAggregateId(): string { return this.purchaseOrderId; }
}

export class DeliveryScheduleUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly purchaseOrderId: string) {}
  public getAggregateId(): string { return this.purchaseOrderId; }
}

export class SupplierConfirmationReceivedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly purchaseOrderId: string) {}
  public getAggregateId(): string { return this.purchaseOrderId; }
}

export class PurchaseOrderPartiallyReceivedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly purchaseOrderId: string) {}
  public getAggregateId(): string { return this.purchaseOrderId; }
}

export class PurchaseOrderFullyReceivedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly purchaseOrderId: string) {}
  public getAggregateId(): string { return this.purchaseOrderId; }
}