import { DomainEvent } from '@saas/core';

export class ProcurementWorkflowStartedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly workflowExecutionId: string, public readonly correlationId: string) {}
  public getAggregateId(): string { return this.workflowExecutionId; }
}

export class BudgetValidationCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly workflowExecutionId: string, public readonly isValid: boolean) {}
  public getAggregateId(): string { return this.workflowExecutionId; }
}

export class ApprovalWorkflowCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly workflowExecutionId: string, public readonly isApproved: boolean) {}
  public getAggregateId(): string { return this.workflowExecutionId; }
}

export class SupplierSelectedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly workflowExecutionId: string, public readonly supplierId: string) {}
  public getAggregateId(): string { return this.workflowExecutionId; }
}

export class PurchaseOrderGenerationRequestedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly workflowExecutionId: string, public readonly requisitionId: string) {}
  public getAggregateId(): string { return this.workflowExecutionId; }
}

export class PurchaseOrderGeneratedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly workflowExecutionId: string, public readonly purchaseOrderId: string) {}
  public getAggregateId(): string { return this.workflowExecutionId; }
}

export class SupplierConfirmationReceivedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly workflowExecutionId: string, public readonly purchaseOrderId: string) {}
  public getAggregateId(): string { return this.workflowExecutionId; }
}

export class ReceivingCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly workflowExecutionId: string, public readonly goodsReceiptId: string) {}
  public getAggregateId(): string { return this.workflowExecutionId; }
}

export class ProcurementWorkflowCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly workflowExecutionId: string) {}
  public getAggregateId(): string { return this.workflowExecutionId; }
}

export class ProcurementWorkflowFailedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(public readonly workflowExecutionId: string, public readonly reason: string) {}
  public getAggregateId(): string { return this.workflowExecutionId; }
}