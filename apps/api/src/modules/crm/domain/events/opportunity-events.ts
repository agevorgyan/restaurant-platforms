import { DomainEvent } from '@saas/events';
import { EventMetadata } from '@saas/events/src/metadata';

export class OpportunityCreated extends DomainEvent<{ opportunityId: string, leadId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { opportunityId: string, leadId: string }, metadata: EventMetadata = {} as any) {
    super(crypto.randomUUID(), 'OpportunityCreated', aggregateId, 'Opportunity', aggregateVersion, new Date(), payload, metadata);
  }
}

export class OpportunityAssigned extends DomainEvent<{ opportunityId: string, assigneeId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { opportunityId: string, assigneeId: string }, metadata: EventMetadata = {} as any) {
    super(crypto.randomUUID(), 'OpportunityAssigned', aggregateId, 'Opportunity', aggregateVersion, new Date(), payload, metadata);
  }
}

export class OpportunityStageChanged extends DomainEvent<{ opportunityId: string, oldStage: string, newStage: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { opportunityId: string, oldStage: string, newStage: string }, metadata: EventMetadata = {} as any) {
    super(crypto.randomUUID(), 'OpportunityStageChanged', aggregateId, 'Opportunity', aggregateVersion, new Date(), payload, metadata);
  }
}

export class OpportunityRevenueUpdated extends DomainEvent<{ opportunityId: string, newRevenue: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { opportunityId: string, newRevenue: number }, metadata: EventMetadata = {} as any) {
    super(crypto.randomUUID(), 'OpportunityRevenueUpdated', aggregateId, 'Opportunity', aggregateVersion, new Date(), payload, metadata);
  }
}

export class OpportunityWon extends DomainEvent<{ opportunityId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { opportunityId: string }, metadata: EventMetadata = {} as any) {
    super(crypto.randomUUID(), 'OpportunityWon', aggregateId, 'Opportunity', aggregateVersion, new Date(), payload, metadata);
  }
}

export class OpportunityLost extends DomainEvent<{ opportunityId: string, reason: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { opportunityId: string, reason: string }, metadata: EventMetadata = {} as any) {
    super(crypto.randomUUID(), 'OpportunityLost', aggregateId, 'Opportunity', aggregateVersion, new Date(), payload, metadata);
  }
}

export class OpportunityReopened extends DomainEvent<{ opportunityId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { opportunityId: string }, metadata: EventMetadata = {} as any) {
    super(crypto.randomUUID(), 'OpportunityReopened', aggregateId, 'Opportunity', aggregateVersion, new Date(), payload, metadata);
  }
}

export class OpportunityArchived extends DomainEvent<{ opportunityId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { opportunityId: string }, metadata: EventMetadata = {} as any) {
    super(crypto.randomUUID(), 'OpportunityArchived', aggregateId, 'Opportunity', aggregateVersion, new Date(), payload, metadata);
  }
}
