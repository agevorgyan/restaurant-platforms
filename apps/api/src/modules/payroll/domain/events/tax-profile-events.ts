import { DomainEvent } from '@saas/events';
import { EventMetadata, createEventMetadata } from '@saas/events';

export class TaxProfileCreated extends DomainEvent<{ profileId: string, employeeReference?: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { profileId: string, employeeReference?: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'TaxProfileCreated', aggregateId, 'TaxProfile', aggregateVersion, new Date(), payload, metadata);
  }
}

export class TaxProfileActivated extends DomainEvent<{ profileId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { profileId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'TaxProfileActivated', aggregateId, 'TaxProfile', aggregateVersion, new Date(), payload, metadata);
  }
}

export class TaxProfileDeactivated extends DomainEvent<{ profileId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { profileId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'TaxProfileDeactivated', aggregateId, 'TaxProfile', aggregateVersion, new Date(), payload, metadata);
  }
}

export class TaxRuleAdded extends DomainEvent<{ profileId: string, ruleCode: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { profileId: string, ruleCode: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'TaxRuleAdded', aggregateId, 'TaxProfile', aggregateVersion, new Date(), payload, metadata);
  }
}

export class TaxRuleRemoved extends DomainEvent<{ profileId: string, ruleId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { profileId: string, ruleId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'TaxRuleRemoved', aggregateId, 'TaxProfile', aggregateVersion, new Date(), payload, metadata);
  }
}

export class TaxExemptionAdded extends DomainEvent<{ profileId: string, exemptionCode: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { profileId: string, exemptionCode: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'TaxExemptionAdded', aggregateId, 'TaxProfile', aggregateVersion, new Date(), payload, metadata);
  }
}

export class TaxExemptionRemoved extends DomainEvent<{ profileId: string, exemptionId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { profileId: string, exemptionId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'TaxExemptionRemoved', aggregateId, 'TaxProfile', aggregateVersion, new Date(), payload, metadata);
  }
}

export class TaxProfileArchived extends DomainEvent<{ profileId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { profileId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'TaxProfileArchived', aggregateId, 'TaxProfile', aggregateVersion, new Date(), payload, metadata);
  }
}
