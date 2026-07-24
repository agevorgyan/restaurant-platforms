import { DomainEvent } from '@saas/events';
import { EventMetadata } from '@saas/events/src/metadata';

export class PayrollDocumentCreated extends DomainEvent<{ documentId: string, type: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { documentId: string, type: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'PayrollDocumentCreated', aggregateId, 'PayrollDocument', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayrollDocumentGenerated extends DomainEvent<{ documentId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { documentId: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'PayrollDocumentGenerated', aggregateId, 'PayrollDocument', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayrollDocumentApproved extends DomainEvent<{ documentId: string, approverId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { documentId: string, approverId: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'PayrollDocumentApproved', aggregateId, 'PayrollDocument', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayrollDocumentRejected extends DomainEvent<{ documentId: string, rejectorId: string, reason: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { documentId: string, rejectorId: string, reason: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'PayrollDocumentRejected', aggregateId, 'PayrollDocument', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayrollDocumentFinalized extends DomainEvent<{ documentId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { documentId: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'PayrollDocumentFinalized', aggregateId, 'PayrollDocument', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayrollDocumentArchived extends DomainEvent<{ documentId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { documentId: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'PayrollDocumentArchived', aggregateId, 'PayrollDocument', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayrollDocumentInvalidated extends DomainEvent<{ documentId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { documentId: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'PayrollDocumentInvalidated', aggregateId, 'PayrollDocument', aggregateVersion, new Date(), payload, metadata);
  }
}
