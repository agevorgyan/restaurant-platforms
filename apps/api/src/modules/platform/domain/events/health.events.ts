/**
 * Enterprise Platform Health & Operations Platform - Domain Events
 *
 * Emitted by Health aggregates and services upon service registrations, health checks,
 * dependency failures, maintenance window transitions, and availability score updates.
 */

import { randomUUID } from 'crypto';
import { HealthType, ServiceStatus } from '../enums/health.enums';

export interface BasePlatformDomainEvent {
  eventId: string;
  eventName: string;
  aggregateId: string;
  tenantId: string;
  timestamp: Date;
}

export class ServiceRegisteredEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ServiceRegistered';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly serviceName: string,
    public readonly serviceVersion: string,
    public readonly healthType: HealthType,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class HealthCheckPassedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'HealthCheckPassed';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly checkType: string,
    public readonly responseTimeMs: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class HealthCheckFailedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'HealthCheckFailed';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly checkType: string,
    public readonly severity: string,
    public readonly message: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class DependencyFailedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'DependencyFailed';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly dependentServiceId: string,
    public readonly targetServiceId: string,
    public readonly isCritical: boolean,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class MaintenanceStartedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'MaintenanceStarted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly windowId: string,
    public readonly reason: string,
    public readonly affectedServiceIds: string[],
    public readonly timestamp: Date = new Date()
  ) {}
}

export class MaintenanceEndedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'MaintenanceEnded';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly windowId: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class AvailabilityUpdatedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'AvailabilityUpdated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly uptimePercentage: number,
    public readonly meetsSla: boolean,
    public readonly timestamp: Date = new Date()
  ) {}
}

export type HealthDomainEvent =
  | ServiceRegisteredEvent
  | HealthCheckPassedEvent
  | HealthCheckFailedEvent
  | DependencyFailedEvent
  | MaintenanceStartedEvent
  | MaintenanceEndedEvent
  | AvailabilityUpdatedEvent;
