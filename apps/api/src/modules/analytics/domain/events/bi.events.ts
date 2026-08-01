/**
 * Enterprise Business Intelligence Platform - Domain Events
 *
 * Emitted by BI Aggregates and Services upon state mutations & analytical queries.
 */

import { randomUUID } from 'crypto';
import { BaseAnalyticsDomainEvent } from './analytics.events';
import { AnalysisType, DimensionType, MeasureType, DrillMode } from '../enums/bi.enums';

export class CubeCreatedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'CubeCreated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly cubeName: string,
    public readonly analysisType: AnalysisType,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class CubeBuiltEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'CubeBuilt';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly dimensionCount: number,
    public readonly measureCount: number,
    public readonly recordCount: number,
    public readonly buildDurationMs: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class CubeRefreshedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'CubeRefreshed';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly refreshedRecordCount: number,
    public readonly refreshDurationMs: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class AnalyticalQueryExecutedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'AnalyticalQueryExecuted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly cubeId: string,
    public readonly analysisType: AnalysisType,
    public readonly drillMode: DrillMode | 'STANDARD',
    public readonly resultCount: number,
    public readonly executionLatencyMs: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class DimensionUpdatedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'DimensionUpdated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly dimensionType: DimensionType,
    public readonly action: 'ADDED' | 'REMOVED' | 'MODIFIED',
    public readonly timestamp: Date = new Date()
  ) {}
}

export class MeasureCalculatedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'MeasureCalculated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly measureType: MeasureType,
    public readonly calculatedValue: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export type BiDomainEvent =
  | CubeCreatedEvent
  | CubeBuiltEvent
  | CubeRefreshedEvent
  | AnalyticalQueryExecutedEvent
  | DimensionUpdatedEvent
  | MeasureCalculatedEvent;
