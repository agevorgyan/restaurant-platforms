export class IndexCreated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly indexName: string,
    public readonly version: number
  ) {}
}

export class IndexUpdated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly indexName: string,
    public readonly version: number
  ) {}
}

export class IndexDeleted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly indexName: string
  ) {}
}

export class ReindexStarted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly sourceIndex: string,
    public readonly targetIndex: string,
    public readonly jobId: string
  ) {}
}

export class ReindexCompleted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly jobId: string,
    public readonly documentCount: number
  ) {}
}

export class AliasSwapped {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly alias: string,
    public readonly newIndexName: string,
    public readonly oldIndexName?: string
  ) {}
}

export class IndexOptimizationCompleted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly indexName: string,
    public readonly metrics: Record<string, any>
  ) {}
}

export class IndexSynchronizationCompleted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly indexName: string,
    public readonly lagMs: number
  ) {}
}
