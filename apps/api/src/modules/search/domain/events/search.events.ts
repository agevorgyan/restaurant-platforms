export class SearchExecuted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly sessionId: string,
    public readonly query: string,
    public readonly scope: string
  ) {}
}

export class SearchCompleted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly sessionId: string,
    public readonly totalHits: number,
    public readonly tookMs: number
  ) {}
}

export class SearchFailed {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly sessionId: string,
    public readonly reason: string
  ) {}
}

export class SearchSuggestionGenerated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly term: string,
    public readonly suggestionCount: number
  ) {}
}

export class SearchIndexRequested {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly module: string,
    public readonly entityId: string
  ) {}
}

export class SearchIndexCompleted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly module: string,
    public readonly documentCount: number
  ) {}
}
