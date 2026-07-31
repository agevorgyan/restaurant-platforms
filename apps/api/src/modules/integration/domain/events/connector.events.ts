/**
 * Enterprise Connector Platform - Domain Events
 *
 * Immutable event definitions for connector lifecycle state transitions,
 * configuration updates, health metrics, and version publications.
 */

import { randomUUID } from 'crypto';
import { ConnectorStatus, ConnectorType } from '../enums/connector.enums';

export interface BaseDomainEvent {
  readonly eventId: string;
  readonly eventName: string;
  readonly aggregateId: string;
  readonly tenantId: string;
  readonly timestamp: Date;
}

export class ConnectorRegisteredEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ConnectorRegistered';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly type: ConnectorType,
    public readonly version: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ConnectorConfiguredEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ConnectorConfigured';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly configurationHash: string,
    public readonly secretArn: string,
    public readonly endpointUrl: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ConnectorConnectedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ConnectorConnected';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly endpointUrl: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ConnectorDisconnectedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ConnectorDisconnected';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly reason: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ConnectorHealthChangedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ConnectorHealthChanged';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly previousStatus: ConnectorStatus,
    public readonly newStatus: ConnectorStatus,
    public readonly healthScore: number,
    public readonly isHealthy: boolean,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ConnectorVersionPublishedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ConnectorVersionPublished';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly newVersion: string,
    public readonly previousVersion: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ConnectorDisabledEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ConnectorDisabled';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly reason: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class HealthCheckCompletedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'HealthCheckCompleted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly status: ConnectorStatus,
    public readonly healthScore: number,
    public readonly latencyMs: number,
    public readonly success: boolean,
    public readonly timestamp: Date = new Date()
  ) {}
}

export type ConnectorDomainEvent =
  | ConnectorRegisteredEvent
  | ConnectorConfiguredEvent
  | ConnectorConnectedEvent
  | ConnectorDisconnectedEvent
  | ConnectorHealthChangedEvent
  | ConnectorVersionPublishedEvent
  | ConnectorDisabledEvent
  | HealthCheckCompletedEvent;
