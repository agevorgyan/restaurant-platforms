/**
 * Enterprise Distributed Configuration Platform - Domain Events
 *
 * Emitted by Configuration aggregates and services upon state mutations,
 * validation completion, publications, propagation broadcasts, rollbacks, and archiving.
 */

import { randomUUID } from 'crypto';
import { BasePlatformDomainEvent } from './health.events';
import { ConfigurationType, EnvironmentType, PropagationStatus } from '../enums/config.enums';

export class ConfigurationCreatedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ConfigurationCreated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly key: string,
    public readonly configType: ConfigurationType,
    public readonly environment: EnvironmentType,
    public readonly version: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ConfigurationValidatedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ConfigurationValidated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly checksum: string,
    public readonly isValid: boolean,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ConfigurationPublishedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ConfigurationPublished';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly key: string,
    public readonly version: string,
    public readonly checksum: string,
    public readonly publishedBy: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ConfigurationPropagatedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ConfigurationPropagated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly environment: EnvironmentType,
    public readonly status: PropagationStatus,
    public readonly latencyMs: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ConfigurationRolledBackEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ConfigurationRolledBack';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly key: string,
    public readonly revertedFromVersion: string,
    public readonly restoredToVersion: string,
    public readonly newRevision: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ConfigurationArchivedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ConfigurationArchived';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly key: string,
    public readonly version: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export type ConfigurationDomainEvent =
  | ConfigurationCreatedEvent
  | ConfigurationValidatedEvent
  | ConfigurationPublishedEvent
  | ConfigurationPropagatedEvent
  | ConfigurationRolledBackEvent
  | ConfigurationArchivedEvent;
