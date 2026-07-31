/**
 * Enterprise Prompt Management Platform - Domain Events
 */

import { randomUUID } from 'crypto';
import { BaseDomainEvent } from './ai.events';
import { PromptType, PromptStatus, EvaluationStatus } from '../enums/prompt.enums';

export class PromptCreatedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'PromptCreated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly type: PromptType,
    public readonly version: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class PromptUpdatedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'PromptUpdated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly version: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class PromptSubmittedForReviewEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'PromptSubmittedForReview';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly submittedBy: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class PromptApprovedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'PromptApproved';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly approvedBy: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class PromptPublishedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'PromptPublished';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly version: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class PromptDeprecatedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'PromptDeprecated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly reason: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class PromptEvaluatedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'PromptEvaluated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly evaluationStatus: EvaluationStatus,
    public readonly overallScore: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class PromptTestExecutedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'PromptTestExecuted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly testName: string,
    public readonly passed: boolean,
    public readonly timestamp: Date = new Date()
  ) {}
}

export type PromptDomainEvent =
  | PromptCreatedEvent
  | PromptUpdatedEvent
  | PromptSubmittedForReviewEvent
  | PromptApprovedEvent
  | PromptPublishedEvent
  | PromptDeprecatedEvent
  | PromptEvaluatedEvent
  | PromptTestExecutedEvent;
