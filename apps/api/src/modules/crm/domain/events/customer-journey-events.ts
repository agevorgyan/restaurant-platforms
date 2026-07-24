import { DomainEvent } from '@saas/events';
import { EventMetadata } from '@saas/events/src/metadata';

export class JourneyCreated extends DomainEvent<{ journeyId: string, customerReference: string, journeyType: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { journeyId: string, customerReference: string, journeyType: string }, metadata: EventMetadata = {} as any) {
    super(crypto.randomUUID(), 'JourneyCreated', aggregateId, 'CustomerJourney', aggregateVersion, new Date(), payload, metadata);
  }
}

export class JourneyStageAdvanced extends DomainEvent<{ journeyId: string, oldStage: string, newStage: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { journeyId: string, oldStage: string, newStage: string }, metadata: EventMetadata = {} as any) {
    super(crypto.randomUUID(), 'JourneyStageAdvanced', aggregateId, 'CustomerJourney', aggregateVersion, new Date(), payload, metadata);
  }
}

export class JourneyHealthUpdated extends DomainEvent<{ journeyId: string, healthScore: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { journeyId: string, healthScore: number }, metadata: EventMetadata = {} as any) {
    super(crypto.randomUUID(), 'JourneyHealthUpdated', aggregateId, 'CustomerJourney', aggregateVersion, new Date(), payload, metadata);
  }
}

export class JourneyMilestoneAdded extends DomainEvent<{ journeyId: string, milestoneName: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { journeyId: string, milestoneName: string }, metadata: EventMetadata = {} as any) {
    super(crypto.randomUUID(), 'JourneyMilestoneAdded', aggregateId, 'CustomerJourney', aggregateVersion, new Date(), payload, metadata);
  }
}

export class JourneyMilestoneCompleted extends DomainEvent<{ journeyId: string, milestoneName: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { journeyId: string, milestoneName: string }, metadata: EventMetadata = {} as any) {
    super(crypto.randomUUID(), 'JourneyMilestoneCompleted', aggregateId, 'CustomerJourney', aggregateVersion, new Date(), payload, metadata);
  }
}

export class JourneyPaused extends DomainEvent<{ journeyId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { journeyId: string }, metadata: EventMetadata = {} as any) {
    super(crypto.randomUUID(), 'JourneyPaused', aggregateId, 'CustomerJourney', aggregateVersion, new Date(), payload, metadata);
  }
}

export class JourneyResumed extends DomainEvent<{ journeyId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { journeyId: string }, metadata: EventMetadata = {} as any) {
    super(crypto.randomUUID(), 'JourneyResumed', aggregateId, 'CustomerJourney', aggregateVersion, new Date(), payload, metadata);
  }
}

export class JourneyClosed extends DomainEvent<{ journeyId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { journeyId: string }, metadata: EventMetadata = {} as any) {
    super(crypto.randomUUID(), 'JourneyClosed', aggregateId, 'CustomerJourney', aggregateVersion, new Date(), payload, metadata);
  }
}

export class JourneyArchived extends DomainEvent<{ journeyId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { journeyId: string }, metadata: EventMetadata = {} as any) {
    super(crypto.randomUUID(), 'JourneyArchived', aggregateId, 'CustomerJourney', aggregateVersion, new Date(), payload, metadata);
  }
}
