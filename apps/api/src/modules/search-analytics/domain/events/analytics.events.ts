export class AnalyticsCollected {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly sessionId: string,
    public readonly payload: any
  ) {}
}

export class OptimizationCompleted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly optimizationId: string,
    public readonly results: any
  ) {}
}

export class SlowQueryDetected {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly queryId: string,
    public readonly latencyMs: number
  ) {}
}

export class ZeroResultDetected {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly queryId: string,
    public readonly rawQuery: string
  ) {}
}

export class RecommendationGenerated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly suggestionId: string,
    public readonly type: string
  ) {}
}

export class SearchTrendUpdated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly topQueries: string[]
  ) {}
}
