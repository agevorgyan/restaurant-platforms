export class WorkflowId {
  constructor(public readonly value: string) {}
}

export class WorkflowVersion {
  constructor(public readonly value: string) {}
}

export class WorkflowDefinition {
  constructor(
    public readonly name: string,
    public readonly steps: any[],
    public readonly metadata: Record<string, any>,
  ) {}
}

export class WorkflowInstanceId {
  constructor(public readonly value: string) {}
}

export class WorkflowState {
  constructor(
    public readonly variables: Record<string, any>,
    public readonly currentSteps: string[],
  ) {}
}

export class WorkflowStep {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: string,
    public readonly config: Record<string, any>,
  ) {}
}

export class WorkflowTrigger {
  constructor(
    public readonly type: string,
    public readonly eventName?: string,
    public readonly cronExpression?: string,
  ) {}
}

export class WorkflowCondition {
  constructor(
    public readonly variable: string,
    public readonly operator: string,
    public readonly value: any,
  ) {}
}

export class WorkflowVariable {
  constructor(
    public readonly key: string,
    public readonly type: string,
    public readonly value: any,
  ) {}
}

export class WorkflowExecutionId {
  constructor(public readonly value: string) {}
}

export class WorkflowTimeout {
  constructor(
    public readonly seconds: number,
    public readonly action: string,
  ) {}
}

export class RetryPolicy {
  constructor(
    public readonly maxAttempts: number,
    public readonly backoffSeconds: number,
  ) {}
}

export class CompensationAction {
  constructor(
    public readonly stepId: string,
    public readonly actionType: string,
    public readonly payload: Record<string, any>,
  ) {}
}
