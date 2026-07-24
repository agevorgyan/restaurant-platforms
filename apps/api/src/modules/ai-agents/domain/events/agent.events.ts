export class AgentCreated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly agentId: string,
    public readonly agentType: string
  ) {}
}

export class AgentGoalReceived {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly agentId: string,
    public readonly executionId: string,
    public readonly goal: string
  ) {}
}

export class AgentPlanGenerated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly agentId: string,
    public readonly executionId: string,
    public readonly stepCount: number
  ) {}
}

export class AgentExecutionStarted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly agentId: string,
    public readonly executionId: string
  ) {}
}

export class ToolInvoked {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly executionId: string,
    public readonly toolName: string,
    public readonly invocationId: string
  ) {}
}

export class ToolCompleted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly executionId: string,
    public readonly toolName: string,
    public readonly invocationId: string,
    public readonly success: boolean
  ) {}
}

export class HumanApprovalRequested {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly executionId: string,
    public readonly toolName: string,
    public readonly requestedByAgentId: string
  ) {}
}

export class HumanApprovalReceived {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly executionId: string,
    public readonly approved: boolean,
    public readonly approvedByUserId: string
  ) {}
}

export class AgentExecutionCompleted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly executionId: string,
    public readonly success: boolean
  ) {}
}

export class AgentExecutionFailed {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly executionId: string,
    public readonly reason: string
  ) {}
}
