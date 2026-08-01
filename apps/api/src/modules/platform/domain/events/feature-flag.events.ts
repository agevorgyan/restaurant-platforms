/**
 * Enterprise Feature Flag Platform - Domain Events
 *
 * Emitted by FeatureFlag aggregates and services upon state mutations, flag activation,
 * evaluation, rollout updates, experiment lifecycle changes, and kill switch activations.
 */

import { randomUUID } from 'crypto';
import { BasePlatformDomainEvent } from './health.events';
import { EvaluationResult, FlagType, RolloutType } from '../enums/feature-flag.enums';

export class FeatureCreatedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'FeatureCreated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly key: string,
    public readonly flagType: FlagType,
    public readonly version: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class FeatureActivatedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'FeatureActivated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly key: string,
    public readonly activatedBy: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class FeatureEvaluatedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'FeatureEvaluated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly key: string,
    public readonly result: EvaluationResult,
    public readonly reason: string,
    public readonly evaluationTimeMs: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class RolloutStartedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'RolloutStarted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly key: string,
    public readonly rolloutType: RolloutType,
    public readonly targetPercentage: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class RolloutCompletedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'RolloutCompleted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly key: string,
    public readonly percentage: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ExperimentStartedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ExperimentStarted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly experimentId: string,
    public readonly featureKey: string,
    public readonly variantsCount: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ExperimentCompletedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ExperimentCompleted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly experimentId: string,
    public readonly winningVariantId?: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class KillSwitchActivatedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'KillSwitchActivated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly key: string,
    public readonly activatedBy: string,
    public readonly reason: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export type FeatureFlagDomainEvent =
  | FeatureCreatedEvent
  | FeatureActivatedEvent
  | FeatureEvaluatedEvent
  | RolloutStartedEvent
  | RolloutCompletedEvent
  | ExperimentStartedEvent
  | ExperimentCompletedEvent
  | KillSwitchActivatedEvent;
