import {
  WorkflowId,
  WorkflowInstanceId,
  WorkflowVersion,
  WorkflowState,
} from '../value-objects';

export class WorkflowCreated {
  constructor(
    public readonly workflowId: WorkflowId,
    public readonly timestamp: Date,
  ) {}
}

export class WorkflowPublished {
  constructor(
    public readonly workflowId: WorkflowId,
    public readonly version: WorkflowVersion,
    public readonly timestamp: Date,
  ) {}
}

export class WorkflowStarted {
  constructor(
    public readonly instanceId: WorkflowInstanceId,
    public readonly workflowId: WorkflowId,
    public readonly version: WorkflowVersion,
    public readonly timestamp: Date,
  ) {}
}

export class WorkflowPaused {
  constructor(
    public readonly instanceId: WorkflowInstanceId,
    public readonly timestamp: Date,
  ) {}
}

export class WorkflowResumed {
  constructor(
    public readonly instanceId: WorkflowInstanceId,
    public readonly timestamp: Date,
  ) {}
}

export class WorkflowCompleted {
  constructor(
    public readonly instanceId: WorkflowInstanceId,
    public readonly finalState: WorkflowState,
    public readonly timestamp: Date,
  ) {}
}

export class WorkflowFailed {
  constructor(
    public readonly instanceId: WorkflowInstanceId,
    public readonly reason: string,
    public readonly timestamp: Date,
  ) {}
}

export class WorkflowCancelled {
  constructor(
    public readonly instanceId: WorkflowInstanceId,
    public readonly timestamp: Date,
  ) {}
}

export class WorkflowCompensated {
  constructor(
    public readonly instanceId: WorkflowInstanceId,
    public readonly timestamp: Date,
  ) {}
}

export class StepStarted {
  constructor(
    public readonly instanceId: WorkflowInstanceId,
    public readonly stepId: string,
    public readonly timestamp: Date,
  ) {}
}

export class StepCompleted {
  constructor(
    public readonly instanceId: WorkflowInstanceId,
    public readonly stepId: string,
    public readonly output: Record<string, any>,
    public readonly timestamp: Date,
  ) {}
}

export class StepFailed {
  constructor(
    public readonly instanceId: WorkflowInstanceId,
    public readonly stepId: string,
    public readonly reason: string,
    public readonly timestamp: Date,
  ) {}
}
