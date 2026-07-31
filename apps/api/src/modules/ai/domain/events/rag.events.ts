/**
 * Enterprise RAG Platform - Domain Events
 */

import { randomUUID } from 'crypto';
import { BaseDomainEvent } from './ai.events';
import { RetrievalType, ContextType } from '../enums/rag.enums';

export class RetrievalStartedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'RetrievalStarted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly queryText: string,
    public readonly retrievalType: RetrievalType,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ChunksRetrievedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ChunksRetrieved';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly retrievedChunksCount: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ContextRankedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ContextRanked';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly topRankedCount: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ContextAssembledEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ContextAssembled';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly tokensCount: number,
    public readonly citationsCount: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class GroundingCompletedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'GroundingCompleted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly groundingPercentage: number,
    public readonly isSufficient: boolean,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ResponseGeneratedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ResponseGenerated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly answerLength: number,
    public readonly citationsCount: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class HallucinationDetectedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'HallucinationDetected';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly groundingPercentage: number,
    public readonly reason: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export type RagDomainEvent =
  | RetrievalStartedEvent
  | ChunksRetrievedEvent
  | ContextRankedEvent
  | ContextAssembledEvent
  | GroundingCompletedEvent
  | ResponseGeneratedEvent
  | HallucinationDetectedEvent;
