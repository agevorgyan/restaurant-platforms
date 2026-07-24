import { DomainEvent } from '@saas/events';
import { EventMetadata } from '@saas/events/src/metadata';

export class LedgerCreated extends DomainEvent<{ ledgerId: string, ledgerCode: string, currency: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { ledgerId: string, ledgerCode: string, currency: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'LedgerCreated', aggregateId, 'Ledger', aggregateVersion, new Date(), payload, metadata);
  }
}

export class LedgerOpened extends DomainEvent<{ ledgerId: string, fiscalYear: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { ledgerId: string, fiscalYear: number }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'LedgerOpened', aggregateId, 'Ledger', aggregateVersion, new Date(), payload, metadata);
  }
}

export class LedgerClosed extends DomainEvent<{ ledgerId: string, closingBalance: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { ledgerId: string, closingBalance: number }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'LedgerClosed', aggregateId, 'Ledger', aggregateVersion, new Date(), payload, metadata);
  }
}

export class LedgerArchived extends DomainEvent<{ ledgerId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { ledgerId: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'LedgerArchived', aggregateId, 'Ledger', aggregateVersion, new Date(), payload, metadata);
  }
}

export class LedgerConfigurationChanged extends DomainEvent<{ ledgerId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { ledgerId: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'LedgerConfigurationChanged', aggregateId, 'Ledger', aggregateVersion, new Date(), payload, metadata);
  }
}
