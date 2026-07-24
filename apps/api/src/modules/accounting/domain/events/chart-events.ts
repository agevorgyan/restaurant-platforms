import { DomainEvent } from '@saas/events';
import { EventMetadata } from '@saas/events/src/metadata';

export class ChartCreated extends DomainEvent<{ chartId: string, chartCode: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { chartId: string, chartCode: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'ChartCreated', aggregateId, 'ChartOfAccounts', aggregateVersion, new Date(), payload, metadata);
  }
}

export class ChartActivated extends DomainEvent<{ chartId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { chartId: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'ChartActivated', aggregateId, 'ChartOfAccounts', aggregateVersion, new Date(), payload, metadata);
  }
}

export class ChartArchived extends DomainEvent<{ chartId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { chartId: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'ChartArchived', aggregateId, 'ChartOfAccounts', aggregateVersion, new Date(), payload, metadata);
  }
}

export class AccountAdded extends DomainEvent<{ chartId: string, accountId: string, accountCode: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { chartId: string, accountId: string, accountCode: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'AccountAdded', aggregateId, 'ChartOfAccounts', aggregateVersion, new Date(), payload, metadata);
  }
}

export class AccountUpdated extends DomainEvent<{ chartId: string, accountId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { chartId: string, accountId: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'AccountUpdated', aggregateId, 'ChartOfAccounts', aggregateVersion, new Date(), payload, metadata);
  }
}

export class AccountMoved extends DomainEvent<{ chartId: string, accountId: string, newParentId: string | null }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { chartId: string, accountId: string, newParentId: string | null }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'AccountMoved', aggregateId, 'ChartOfAccounts', aggregateVersion, new Date(), payload, metadata);
  }
}

export class AccountDeactivated extends DomainEvent<{ chartId: string, accountId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { chartId: string, accountId: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'AccountDeactivated', aggregateId, 'ChartOfAccounts', aggregateVersion, new Date(), payload, metadata);
  }
}

export class AccountMappingChanged extends DomainEvent<{ chartId: string, accountId: string, externalSystem: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { chartId: string, accountId: string, externalSystem: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'AccountMappingChanged', aggregateId, 'ChartOfAccounts', aggregateVersion, new Date(), payload, metadata);
  }
}
