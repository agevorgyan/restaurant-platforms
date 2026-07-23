import { DomainEvent } from '@saas/core';

export class PurchaseRequisitionCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly requisitionId: string) {}
  public getAggregateId(): string { return this.requisitionId; }
}

export class PurchaseRequisitionSubmittedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly requisitionId: string, public readonly numberValue: string) {}
  public getAggregateId(): string { return this.requisitionId; }
}

export class PurchaseRequisitionApprovedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly requisitionId: string) {}
  public getAggregateId(): string { return this.requisitionId; }
}

export class PurchaseRequisitionRejectedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly requisitionId: string, public readonly reason: string) {}
  public getAggregateId(): string { return this.requisitionId; }
}

export class PurchaseRequisitionCancelledEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly requisitionId: string) {}
  public getAggregateId(): string { return this.requisitionId; }
}

export class PurchaseRequisitionConvertedToPurchaseOrderEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly requisitionId: string, public readonly purchaseOrderId: string) {}
  public getAggregateId(): string { return this.requisitionId; }
}

export class RequisitionLineAddedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly requisitionId: string, public readonly lineId: string) {}
  public getAggregateId(): string { return this.requisitionId; }
}

export class RequisitionLineRemovedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly requisitionId: string, public readonly lineId: string) {}
  public getAggregateId(): string { return this.requisitionId; }
}

export class ApprovalRequestedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly requisitionId: string, public readonly approvalStepId: string) {}
  public getAggregateId(): string { return this.requisitionId; }
}

export class ApprovalCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly requisitionId: string, public readonly approvalStepId: string) {}
  public getAggregateId(): string { return this.requisitionId; }
}
