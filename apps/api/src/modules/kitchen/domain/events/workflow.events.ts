import { DomainEvent } from '@saas/core';

export class WorkflowStartedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly workflowId: string, // Could be ticket ID or production ID
    public readonly triggeredBy: string
  ) {}

  public getAggregateId(): string {
    return this.workflowId;
  }
}

export class WorkflowCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly workflowId: string,
    public readonly triggeredBy: string
  ) {}

  public getAggregateId(): string {
    return this.workflowId;
  }
}

export class WorkflowPausedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly workflowId: string,
    public readonly reason: string,
    public readonly triggeredBy: string
  ) {}

  public getAggregateId(): string {
    return this.workflowId;
  }
}

export class WorkflowResumedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly workflowId: string,
    public readonly triggeredBy: string
  ) {}

  public getAggregateId(): string {
    return this.workflowId;
  }
}

export class StationAssignedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly itemId: string,
    public readonly stationId: string,
    public readonly triggeredBy: string
  ) {}

  public getAggregateId(): string {
    return this.itemId;
  }
}

export class QueueUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly stationId: string,
    public readonly queueDepth: number
  ) {}

  public getAggregateId(): string {
    return this.stationId;
  }
}

export class EstimatedCompletionUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly itemId: string,
    public readonly estimatedCompletionTime: Date
  ) {}

  public getAggregateId(): string {
    return this.itemId;
  }
}
