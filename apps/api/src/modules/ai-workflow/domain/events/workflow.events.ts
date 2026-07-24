export class WorkflowCreated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly workflowId: string,
    public readonly name: string
  ) {}
}

export class WorkflowStarted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly executionId: string,
    public readonly workflowId: string
  ) {}
}

export class WorkflowCheckpointCreated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly executionId: string,
    public readonly stepId: string
  ) {}
}

export class WorkflowCompleted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly executionId: string,
    public readonly durationMs: number
  ) {}
}

export class WorkflowFailed {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly executionId: string,
    public readonly reason: string
  ) {}
}

export class ToolRegistered {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly toolId: string,
    public readonly name: string
  ) {}
}

export class ToolInvoked {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly executionId: string,
    public readonly toolId: string,
    public readonly invocationId: string
  ) {}
}

export class ToolCompleted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly executionId: string,
    public readonly invocationId: string,
    public readonly success: boolean
  ) {}
}

export class ToolFailed {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly executionId: string,
    public readonly invocationId: string,
    public readonly error: string
  ) {}
}

export class ApprovalStepReached {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly executionId: string,
    public readonly stepId: string
  ) {}
}
