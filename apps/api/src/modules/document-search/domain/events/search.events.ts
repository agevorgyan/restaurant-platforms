export class DocumentIndexed {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly documentId: string,
    public readonly tenantId: string,
    public readonly indexVersion: number
  ) {}
}

export class DocumentReindexed {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly documentId: string,
    public readonly tenantId: string,
    public readonly oldIndexVersion: number,
    public readonly newIndexVersion: number
  ) {}
}

export class DocumentRemovedFromIndex {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly documentId: string,
    public readonly tenantId: string
  ) {}
}

export class IndexBuildStarted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly indexType: string
  ) {}
}

export class IndexBuildCompleted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly indexType: string,
    public readonly documentsIndexed: number,
    public readonly durationMs: number
  ) {}
}

export class IndexBuildFailed {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly indexType: string,
    public readonly errorCode: string,
    public readonly errorMessage: string
  ) {}
}
