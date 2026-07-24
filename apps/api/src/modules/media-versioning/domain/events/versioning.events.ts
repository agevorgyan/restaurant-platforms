export class MediaVersionCreated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly versionId: string,
    public readonly versionNumber: number
  ) {}
}

export class MediaVersionArchived {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly versionId: string,
    public readonly storageTier: string
  ) {}
}

export class MediaVersionRestored {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly versionId: string
  ) {}
}

export class MediaExpired {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string
  ) {}
}

export class MediaRetentionApplied {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly policyId: string
  ) {}
}

export class MediaDeleted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly isHardDelete: boolean
  ) {}
}

export class LifecycleTransitionCompleted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly fromState: string,
    public readonly toState: string
  ) {}
}

export class CacheInvalidationRequested {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly versionId: string
  ) {}
}

export class TransformationRegenerationRequested {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly versionId: string
  ) {}
}
