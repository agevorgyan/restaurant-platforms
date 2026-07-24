export class MediaUploaded {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly mediaType: string,
    public readonly mimeType: string,
    public readonly fileSize: number,
    public readonly checksum: string
  ) {}
}

export class MediaProcessingStarted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly processingJobId: string
  ) {}
}

export class MediaProcessingCompleted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly processingJobId: string,
    public readonly outputs: Record<string, string> // e.g. { "720p": "s3://...", "thumbnail": "s3://..." }
  ) {}
}

export class MediaArchived {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string
  ) {}
}

export class MediaDeleted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string
  ) {}
}

export class MediaRestored {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string
  ) {}
}

export class MediaMetadataUpdated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly updates: Record<string, any>
  ) {}
}
