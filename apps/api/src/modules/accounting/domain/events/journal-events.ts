import { DomainEvent } from '@saas/events';
import { EventMetadata, createEventMetadata } from '@saas/events';

export class JournalCreated extends DomainEvent<{ journalId: string, journalNumber: string, currency: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { journalId: string, journalNumber: string, currency: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'JournalCreated', aggregateId, 'JournalEntry', aggregateVersion, new Date(), payload, metadata);
  }
}

export class JournalApproved extends DomainEvent<{ journalId: string, approverId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { journalId: string, approverId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'JournalApproved', aggregateId, 'JournalEntry', aggregateVersion, new Date(), payload, metadata);
  }
}

export class JournalPosted extends DomainEvent<{ journalId: string, postingDate: Date }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { journalId: string, postingDate: Date }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'JournalPosted', aggregateId, 'JournalEntry', aggregateVersion, new Date(), payload, metadata);
  }
}

export class JournalReversed extends DomainEvent<{ journalId: string, reversedBy: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { journalId: string, reversedBy: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'JournalReversed', aggregateId, 'JournalEntry', aggregateVersion, new Date(), payload, metadata);
  }
}

export class JournalVoided extends DomainEvent<{ journalId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { journalId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'JournalVoided', aggregateId, 'JournalEntry', aggregateVersion, new Date(), payload, metadata);
  }
}
