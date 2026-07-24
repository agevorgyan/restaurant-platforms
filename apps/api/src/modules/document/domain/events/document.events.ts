import { DomainEvent } from '@saas/domain';

export class DocumentCreated extends DomainEvent {
  constructor(
    public readonly documentId: string,
    public readonly tenantId: string,
    public readonly documentType: string,
    public readonly visibility: string,
    public readonly createdBy: string
  ) {
    super();
  }
}

export class DocumentUploaded extends DomainEvent {
  constructor(
    public readonly documentId: string,
    public readonly tenantId: string,
    public readonly objectKey: string,
    public readonly fileSize: number,
    public readonly checksum: string
  ) {
    super();
  }
}

export class DocumentArchived extends DomainEvent {
  constructor(
    public readonly documentId: string,
    public readonly tenantId: string
  ) {
    super();
  }
}

export class DocumentDeleted extends DomainEvent {
  constructor(
    public readonly documentId: string,
    public readonly tenantId: string
  ) {
    super();
  }
}

export class DocumentRestored extends DomainEvent {
  constructor(
    public readonly documentId: string,
    public readonly tenantId: string
  ) {
    super();
  }
}

export class DocumentMetadataUpdated extends DomainEvent {
  constructor(
    public readonly documentId: string,
    public readonly tenantId: string,
    public readonly updates: Record<string, any>
  ) {
    super();
  }
}

export class DocumentProcessingStarted extends DomainEvent {
  constructor(
    public readonly documentId: string,
    public readonly tenantId: string,
    public readonly processorType: string
  ) {
    super();
  }
}

export class DocumentProcessingCompleted extends DomainEvent {
  constructor(
    public readonly documentId: string,
    public readonly tenantId: string,
    public readonly processorType: string,
    public readonly results: Record<string, any>
  ) {
    super();
  }
}
