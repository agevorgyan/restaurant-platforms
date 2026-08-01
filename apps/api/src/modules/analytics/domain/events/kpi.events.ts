/**
 * Enterprise KPI Platform - Domain Events
 */

import { randomUUID } from 'crypto';
import { BaseAnalyticsDomainEvent } from './analytics.events';
import { KpiType, ThresholdStatus } from '../enums/kpi.enums';

export class KpiCreatedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'KpiCreated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly kpiType: KpiType,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class KpiCalculatedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'KpiCalculated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly calculatedValue: number,
    public readonly status: ThresholdStatus,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class TargetExceededEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'TargetExceeded';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly targetValue: number,
    public readonly actualValue: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ThresholdCrossedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ThresholdCrossed';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly previousStatus: ThresholdStatus,
    public readonly newStatus: ThresholdStatus,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ScoreUpdatedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ScoreUpdated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly newScore: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class KpiArchivedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'KpiArchived';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export type KpiDomainEvent =
  | KpiCreatedEvent
  | KpiCalculatedEvent
  | TargetExceededEvent
  | ThresholdCrossedEvent
  | ScoreUpdatedEvent
  | KpiArchivedEvent;
