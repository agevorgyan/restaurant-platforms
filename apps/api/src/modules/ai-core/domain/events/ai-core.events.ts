export class AiSessionStarted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly sessionId: string,
    public readonly userId: string
  ) {}
}

export class AiRequestSubmitted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly sessionId: string,
    public readonly requestId: string,
    public readonly type: string
  ) {}
}

export class AiExecutionStarted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly executionId: string,
    public readonly modelRef: any
  ) {}
}

export class AiExecutionCompleted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly executionId: string,
    public readonly latencyMs: number
  ) {}
}

export class AiExecutionFailed {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly executionId: string,
    public readonly reason: string
  ) {}
}

export class AiSessionClosed {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly sessionId: string
  ) {}
}

export class AiUsageRecorded {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly executionId: string,
    public readonly usage: any,
    public readonly cost: number
  ) {}
}
