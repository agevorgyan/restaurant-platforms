/**
 * Enterprise Embedding & Vector Platform - Domain Events
 */

import { randomUUID } from 'crypto';
import { BaseDomainEvent } from './ai.events';
import { VectorType, CollectionType } from '../enums/vector.enums';

export class CollectionCreatedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'CollectionCreated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly collectionType: CollectionType,
    public readonly dimension: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class EmbeddingGeneratedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'EmbeddingGenerated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly collectionId: string,
    public readonly vectorType: VectorType,
    public readonly dimension: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class EmbeddingUpdatedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'EmbeddingUpdated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly collectionId: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class EmbeddingArchivedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'EmbeddingArchived';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class VectorIndexedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'VectorIndexed';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly collectionId: string,
    public readonly vectorId: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class VectorRemovedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'VectorRemoved';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly collectionId: string,
    public readonly vectorId: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class SemanticSearchExecutedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'SemanticSearchExecuted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly collectionId: string,
    public readonly queryText: string,
    public readonly resultsCount: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export type VectorDomainEvent =
  | CollectionCreatedEvent
  | EmbeddingGeneratedEvent
  | EmbeddingUpdatedEvent
  | EmbeddingArchivedEvent
  | VectorIndexedEvent
  | VectorRemovedEvent
  | SemanticSearchExecutedEvent;
