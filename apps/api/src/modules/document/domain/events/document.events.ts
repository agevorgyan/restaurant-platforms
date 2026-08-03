import { DomainEvent } from '@saas/core';

export class DocumentCreated implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(
    public readonly documentId: string,
    public readonly tenantId: string,
    public readonly documentType: string,
    public readonly visibility: string,
    public readonly createdBy: string
  ) {}
  public getAggregateId(): string { return this.documentId; }
}

export class DocumentUploaded implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(
    public readonly documentId: string,
    public readonly tenantId: string,
    public readonly objectKey: string,
    public readonly fileSize: number,
    public readonly checksum: string
  ) {}
  public getAggregateId(): string { return this.documentId; }
}

export class DocumentArchived implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(
    public readonly documentId: string,
    public readonly tenantId: string
  ) {}
  public getAggregateId(): string { return this.documentId; }
}

export class DocumentDeleted implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(
    public readonly documentId: string,
    public readonly tenantId: string
  ) {}
  public getAggregateId(): string { return this.documentId; }
}

export class DocumentRestored implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(
    public readonly documentId: string,
    public readonly tenantId: string
  ) {}
  public getAggregateId(): string { return this.documentId; }
}

export class DocumentMetadataUpdated implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(
    public readonly documentId: string,
    public readonly tenantId: string,
    public readonly updates: Record<string, any>
  ) {}
  public getAggregateId(): string { return this.documentId; }
}

export class DocumentProcessingStarted implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(
    public readonly documentId: string,
    public readonly tenantId: string,
    public readonly processorType: string
  ) {}
  public getAggregateId(): string { return this.documentId; }
}

export class DocumentProcessingCompleted implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  constructor(
    public readonly documentId: string,
    public readonly tenantId: string,
    public readonly processorType: string,
    public readonly results: Record<string, any>
  ) {}
  public getAggregateId(): string { return this.documentId; }
}
