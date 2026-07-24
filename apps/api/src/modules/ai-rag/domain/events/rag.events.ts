export class RetrievalStarted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly retrievalId: string,
    public readonly query: string
  ) {}
}

export class KnowledgeRetrieved {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly retrievalId: string,
    public readonly chunkCount: number
  ) {}
}

export class ContextAssembled {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly retrievalId: string,
    public readonly tokenCount: number
  ) {}
}

export class EmbeddingGenerated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly documentId: string,
    public readonly chunkId: string
  ) {}
}

export class EmbeddingUpdated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly documentId: string,
    public readonly chunkId: string
  ) {}
}

export class RetrievalCompleted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly retrievalId: string,
    public readonly executionTimeMs: number
  ) {}
}

export class RetrievalFailed {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly retrievalId: string,
    public readonly reason: string
  ) {}
}
