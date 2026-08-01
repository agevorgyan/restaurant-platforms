/**
 * Enterprise Forecasting & Predictive Analytics Platform - Domain Events
 *
 * Emitted by Forecasting Aggregates and Services upon model creation, generation,
 * trend detection, seasonality pattern discovery, anomaly alerts, and predictions publishing.
 */

import { randomUUID } from 'crypto';
import { BaseAnalyticsDomainEvent } from './analytics.events';
import { ForecastType, ModelType } from '../enums/forecasting.enums';

export class ForecastCreatedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ForecastCreated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly forecastType: ForecastType,
    public readonly modelType: ModelType,
    public readonly version: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ForecastGeneratedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ForecastGenerated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly predictionCount: number,
    public readonly confidenceScore: number,
    public readonly generationLatencyMs: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class TrendDetectedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'TrendDetected';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly direction: 'UPWARD' | 'DOWNWARD' | 'FLAT',
    public readonly slope: number,
    public readonly changePercentage: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class SeasonalityDetectedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'SeasonalityDetected';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly periodicity: string,
    public readonly seasonalityIndex: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class AnomalyDetectedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'AnomalyDetected';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly anomalyScore: number,
    public readonly deviationSigma: number,
    public readonly anomalyType: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class PredictionPublishedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'PredictionPublished';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly predictionId: string,
    public readonly predictedValue: number,
    public readonly confidenceScore: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ForecastArchivedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ForecastArchived';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly version: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export type ForecastingDomainEvent =
  | ForecastCreatedEvent
  | ForecastGeneratedEvent
  | TrendDetectedEvent
  | SeasonalityDetectedEvent
  | AnomalyDetectedEvent
  | PredictionPublishedEvent
  | ForecastArchivedEvent;
