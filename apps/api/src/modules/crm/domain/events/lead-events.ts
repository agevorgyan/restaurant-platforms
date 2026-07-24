import { DomainEvent } from '@saas/events';
import { EventMetadata } from '@saas/events/src/metadata';

export class LeadCreated extends DomainEvent<{ leadId: string, email: string, source: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { leadId: string, email: string, source: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'LeadCreated', aggregateId, 'Lead', aggregateVersion, new Date(), payload, metadata);
  }
}

export class LeadQualified extends DomainEvent<{ leadId: string, qualifiedBy: string, score: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { leadId: string, qualifiedBy: string, score: number }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'LeadQualified', aggregateId, 'Lead', aggregateVersion, new Date(), payload, metadata);
  }
}

export class LeadDisqualified extends DomainEvent<{ leadId: string, reason: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { leadId: string, reason: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'LeadDisqualified', aggregateId, 'Lead', aggregateVersion, new Date(), payload, metadata);
  }
}

export class LeadAssigned extends DomainEvent<{ leadId: string, assigneeId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { leadId: string, assigneeId: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'LeadAssigned', aggregateId, 'Lead', aggregateVersion, new Date(), payload, metadata);
  }
}

export class LeadConvertedToOpportunity extends DomainEvent<{ leadId: string, opportunityId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { leadId: string, opportunityId: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'LeadConvertedToOpportunity', aggregateId, 'Lead', aggregateVersion, new Date(), payload, metadata);
  }
}

export class LeadConvertedToCustomer extends DomainEvent<{ leadId: string, customerId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { leadId: string, customerId: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'LeadConvertedToCustomer', aggregateId, 'Lead', aggregateVersion, new Date(), payload, metadata);
  }
}

export class LeadArchived extends DomainEvent<{ leadId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { leadId: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'LeadArchived', aggregateId, 'Lead', aggregateVersion, new Date(), payload, metadata);
  }
}
