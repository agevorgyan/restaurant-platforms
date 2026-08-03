import { DomainEvent } from '@saas/core';

export class MediaUploaded implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly mediaType: string,
    public readonly mimeType: string,
    public readonly fileSize: number,
    public readonly checksum: string
  ) {}
  public getAggregateId(): string { return this.mediaId; }
}

export class MediaProcessingStarted implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly processingJobId: string
  ) {}
  public getAggregateId(): string { return this.mediaId; }
}

export class MediaProcessingCompleted implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly processingJobId: string,
    public readonly outputs: Record<string, string>
  ) {}
  public getAggregateId(): string { return this.mediaId; }
}

export class MediaArchived implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string
  ) {}
  public getAggregateId(): string { return this.mediaId; }
}

export class MediaDeleted implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string
  ) {}
  public getAggregateId(): string { return this.mediaId; }
}

export class MediaRestored implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string
  ) {}
  public getAggregateId(): string { return this.mediaId; }
}

export class MediaMetadataUpdated implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly updates: Record<string, any>
  ) {}
  public getAggregateId(): string { return this.mediaId; }
}
