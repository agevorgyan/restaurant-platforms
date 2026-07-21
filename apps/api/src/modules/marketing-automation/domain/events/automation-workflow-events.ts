import { DomainEvent } from '@saas/core';

export class WorkflowCreated implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly workflowId: string, public readonly name: string) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.workflowId; }
}

export class WorkflowActivated implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly workflowId: string) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.workflowId; }
}

export class WorkflowPaused implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly workflowId: string, public readonly reason?: string) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.workflowId; }
}

export class WorkflowResumed implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly workflowId: string) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.workflowId; }
}

export class WorkflowCompleted implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly workflowId: string) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.workflowId; }
}

export class WorkflowCancelled implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly workflowId: string, public readonly reason?: string) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.workflowId; }
}

export class WorkflowTriggered implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly workflowId: string, public readonly triggerId: string) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.workflowId; }
}

export class WorkflowExecutionStarted implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly workflowId: string, public readonly executionId: string) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.workflowId; }
}

export class WorkflowExecutionCompleted implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly workflowId: string, public readonly executionId: string) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.workflowId; }
}

export class WorkflowExecutionFailed implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly workflowId: string, public readonly executionId: string, public readonly error: string) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.workflowId; }
}
