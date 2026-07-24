import { DomainEvent } from '@saas/events';
import { EventMetadata } from '@saas/events/src/metadata';

export class FinancialPeriodCreated extends DomainEvent<{ periodId: string, periodCode: string, startDate: Date, endDate: Date }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { periodId: string, periodCode: string, startDate: Date, endDate: Date }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'FinancialPeriodCreated', aggregateId, 'FinancialPeriod', aggregateVersion, new Date(), payload, metadata);
  }
}

export class FinancialPeriodOpened extends DomainEvent<{ periodId: string, openedBy: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { periodId: string, openedBy: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'FinancialPeriodOpened', aggregateId, 'FinancialPeriod', aggregateVersion, new Date(), payload, metadata);
  }
}

export class FinancialPeriodClosed extends DomainEvent<{ periodId: string, closedBy: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { periodId: string, closedBy: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'FinancialPeriodClosed', aggregateId, 'FinancialPeriod', aggregateVersion, new Date(), payload, metadata);
  }
}

export class FinancialPeriodLocked extends DomainEvent<{ periodId: string, lockedBy: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { periodId: string, lockedBy: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'FinancialPeriodLocked', aggregateId, 'FinancialPeriod', aggregateVersion, new Date(), payload, metadata);
  }
}

export class FinancialPeriodReopened extends DomainEvent<{ periodId: string, reopenedBy: string, reason: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { periodId: string, reopenedBy: string, reason: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'FinancialPeriodReopened', aggregateId, 'FinancialPeriod', aggregateVersion, new Date(), payload, metadata);
  }
}

export class FinancialPeriodArchived extends DomainEvent<{ periodId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { periodId: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'FinancialPeriodArchived', aggregateId, 'FinancialPeriod', aggregateVersion, new Date(), payload, metadata);
  }
}
