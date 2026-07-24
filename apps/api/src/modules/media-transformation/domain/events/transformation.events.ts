export class MediaTransformationStarted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly jobId: string,
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly profileId: string
  ) {}
}

export class MediaTransformationCompleted {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly jobId: string,
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly profileId: string,
    public readonly artifacts: Record<string, string>
  ) {}
}

export class MediaTransformationFailed {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly jobId: string,
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly errorCode: string,
    public readonly errorMessage: string
  ) {}
}

export class ThumbnailGenerated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly thumbnailStorageKey: string
  ) {}
}

export class ResponsiveImagesGenerated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly variants: Record<string, string> // e.g. { "sm": "...", "md": "...", "lg": "..." }
  ) {}
}

export class VideoTranscoded {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly playlistStorageKey: string // e.g., HLS .m3u8 path
  ) {}
}

export class AudioProcessed {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly processedStorageKey: string
  ) {}
}
