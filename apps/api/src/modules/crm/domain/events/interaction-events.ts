import { DomainEvent } from '@saas/events';
import { EventMetadata, createEventMetadata } from '@saas/events';

export class InteractionCreated extends DomainEvent<{ interactionId: string, channel: string, type: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { interactionId: string, channel: string, type: string }, metadata: EventMetadata = createEventMetadata() as any) {
    super(crypto.randomUUID(), 'InteractionCreated', aggregateId, 'Interaction', aggregateVersion, new Date(), payload, metadata);
  }
}

export class InteractionAssigned extends DomainEvent<{ interactionId: string, assigneeId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { interactionId: string, assigneeId: string }, metadata: EventMetadata = createEventMetadata() as any) {
    super(crypto.randomUUID(), 'InteractionAssigned', aggregateId, 'Interaction', aggregateVersion, new Date(), payload, metadata);
  }
}

export class InteractionOutcomeRecorded extends DomainEvent<{ interactionId: string, outcome: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { interactionId: string, outcome: string }, metadata: EventMetadata = createEventMetadata() as any) {
    super(crypto.randomUUID(), 'InteractionOutcomeRecorded', aggregateId, 'Interaction', aggregateVersion, new Date(), payload, metadata);
  }
}

export class InteractionNoteAdded extends DomainEvent<{ interactionId: string, authorId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { interactionId: string, authorId: string }, metadata: EventMetadata = createEventMetadata() as any) {
    super(crypto.randomUUID(), 'InteractionNoteAdded', aggregateId, 'Interaction', aggregateVersion, new Date(), payload, metadata);
  }
}

export class FollowUpScheduled extends DomainEvent<{ interactionId: string, scheduledDate: Date, assignedTo: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { interactionId: string, scheduledDate: Date, assignedTo: string }, metadata: EventMetadata = createEventMetadata() as any) {
    super(crypto.randomUUID(), 'FollowUpScheduled', aggregateId, 'Interaction', aggregateVersion, new Date(), payload, metadata);
  }
}

export class InteractionClosed extends DomainEvent<{ interactionId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { interactionId: string }, metadata: EventMetadata = createEventMetadata() as any) {
    super(crypto.randomUUID(), 'InteractionClosed', aggregateId, 'Interaction', aggregateVersion, new Date(), payload, metadata);
  }
}

export class InteractionArchived extends DomainEvent<{ interactionId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { interactionId: string }, metadata: EventMetadata = createEventMetadata() as any) {
    super(crypto.randomUUID(), 'InteractionArchived', aggregateId, 'Interaction', aggregateVersion, new Date(), payload, metadata);
  }
}
