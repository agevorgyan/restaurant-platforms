export class QueryParsed {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly queryId: string,
    public readonly rawQuery: string,
    public readonly ast: any
  ) {}
}

export class QueryOptimized {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly queryId: string,
    public readonly optimizedAst: any,
    public readonly costEstimate: number
  ) {}
}

export class ExecutionPlanCreated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly queryId: string,
    public readonly plan: any
  ) {}
}

export class ExecutionStrategySelected {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly queryId: string,
    public readonly strategy: string
  ) {}
}

export class QueryExecuted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly queryId: string,
    public readonly tookMs: number,
    public readonly providerTarget: string
  ) {}
}

export class ResultsMerged {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly queryId: string,
    public readonly totalHits: number,
    public readonly mergeTookMs: number
  ) {}
}

export class QueryExecutionFailed {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly queryId: string,
    public readonly reason: string
  ) {}
}
