import { randomUUID } from 'crypto';

export interface BaseDomainEvent {
  readonly eventId: string;
  readonly eventName: string;
  readonly aggregateId: string;
  readonly tenantId: string;
  readonly timestamp: Date;
}

import { ProviderType, ProviderStatus, ModelType } from '../enums/ai.enums';

export class ProviderRegisteredEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ProviderRegistered';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly providerName: string,
    public readonly providerType: ProviderType,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ProviderHealthChangedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ProviderHealthChanged';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly providerType: ProviderType,
    public readonly oldStatus: ProviderStatus,
    public readonly newStatus: ProviderStatus,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class InferenceStartedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'InferenceStarted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly providerType: ProviderType,
    public readonly modelType: ModelType,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class InferenceCompletedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'InferenceCompleted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly providerType: ProviderType,
    public readonly modelId: string,
    public readonly totalTokens: number,
    public readonly totalCostUsd: number,
    public readonly durationMs: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class InferenceFailedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'InferenceFailed';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly providerType: ProviderType,
    public readonly reason: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ProviderFailoverTriggeredEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ProviderFailoverTriggered';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly primaryProvider: ProviderType,
    public readonly fallbackProvider: ProviderType,
    public readonly reason: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class CostThresholdExceededEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'CostThresholdExceeded';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly currentCostUsd: number,
    public readonly thresholdLimitUsd: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export type AiDomainEvent =
  | ProviderRegisteredEvent
  | ProviderHealthChangedEvent
  | InferenceStartedEvent
  | InferenceCompletedEvent
  | InferenceFailedEvent
  | ProviderFailoverTriggeredEvent
  | CostThresholdExceededEvent;
