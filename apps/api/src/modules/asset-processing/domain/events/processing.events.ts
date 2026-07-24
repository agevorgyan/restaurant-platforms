export class AssetUploaded {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly documentId: string,
    public readonly tenantId: string,
    public readonly mimeType: string,
    public readonly sizeBytes: number
  ) {}
}

export class ProcessingStarted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly jobId: string,
    public readonly documentId: string,
    public readonly tenantId: string
  ) {}
}

export class ProcessingCompleted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly jobId: string,
    public readonly documentId: string,
    public readonly artifacts: Record<string, string>,
    public readonly extractedMetadata?: Record<string, any>
  ) {}
}

export class ProcessingFailed {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly jobId: string,
    public readonly documentId: string,
    public readonly errorCode: string,
    public readonly errorMessage: string
  ) {}
}

export class PreviewGenerated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly jobId: string,
    public readonly documentId: string,
    public readonly previewUrl: string
  ) {}
}

export class ThumbnailGenerated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly jobId: string,
    public readonly documentId: string,
    public readonly thumbnailUrl: string
  ) {}
}

export class MetadataExtracted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly jobId: string,
    public readonly documentId: string,
    public readonly metadata: Record<string, any>
  ) {}
}

export class VirusScanCompleted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly jobId: string,
    public readonly documentId: string,
    public readonly isSafe: boolean,
    public readonly details?: string
  ) {}
}
