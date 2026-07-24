export class PromptCreated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly promptId: string,
    public readonly name: string
  ) {}
}

export class PromptUpdated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly promptId: string
  ) {}
}

export class PromptVersionCreated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly promptId: string,
    public readonly versionId: string
  ) {}
}

export class PromptSubmittedForReview {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly promptId: string,
    public readonly versionId: string,
    public readonly submittedBy: string
  ) {}
}

export class PromptApproved {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly promptId: string,
    public readonly versionId: string,
    public readonly approvedBy: string
  ) {}
}

export class PromptPublished {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly promptId: string,
    public readonly versionId: string
  ) {}
}

export class PromptDeprecated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly promptId: string
  ) {}
}

export class PromptArchived {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly promptId: string
  ) {}
}
