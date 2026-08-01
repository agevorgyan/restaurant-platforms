/**
 * Enterprise Tenant Provisioning Platform - Domain Events
 *
 * Emitted by TenantProvisioning aggregates and services upon onboarding initiation,
 * workspace creation, resource allocations, module initializations, saga completion,
 * step failures, and compensation rollbacks.
 */

import { randomUUID } from 'crypto';
import { BasePlatformDomainEvent } from './health.events';
import { LifecycleStage, ProvisioningStatus, TenantType } from '../enums/provisioning.enums';

export class ProvisioningStartedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ProvisioningStarted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly tenantSlug: string,
    public readonly tenantType: TenantType,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class WorkspaceCreatedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'WorkspaceCreated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly workspaceId: string,
    public readonly templateName: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ResourcesAllocatedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ResourcesAllocated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly resourcesCount: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ModulesInitializedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ModulesInitialized';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly initializedModules: string[],
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ProvisioningCompletedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ProvisioningCompleted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly tenantSlug: string,
    public readonly stage: LifecycleStage,
    public readonly durationMs: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ProvisioningFailedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ProvisioningFailed';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly failedStep: string,
    public readonly reason: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ProvisioningRolledBackEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ProvisioningRolledBack';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly compensatedStepsCount: number,
    public readonly reason: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export type ProvisioningDomainEvent =
  | ProvisioningStartedEvent
  | WorkspaceCreatedEvent
  | ResourcesAllocatedEvent
  | ModulesInitializedEvent
  | ProvisioningCompletedEvent
  | ProvisioningFailedEvent
  | ProvisioningRolledBackEvent;
