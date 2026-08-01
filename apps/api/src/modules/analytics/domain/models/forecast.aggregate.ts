/**
 * Enterprise Forecasting & Predictive Analytics Platform - Domain Aggregate Root
 *
 * ForecastAggregate encapsulates forecasting model definitions, hyperparameters, prediction windows,
 * version control (Major.Minor), lifecycle status transitions (DRAFT -> TRAINING -> READY -> PUBLISHED -> ARCHIVED),
 * and domain event dispatching.
 */

import { ForecastStatus, ForecastType, ModelType } from '../enums/forecasting.enums';
import {
  AnomalyScore,
  ForecastDefinition,
  ForecastId,
  ForecastModel,
  ForecastVersion,
  ForecastWindow,
  SeasonalityPattern,
  Trend,
} from '../value-objects/forecasting-vo';
import { BaseAnalyticsDomainEvent } from '../events/analytics.events';
import {
  AnomalyDetectedEvent,
  ForecastArchivedEvent,
  ForecastCreatedEvent,
  ForecastGeneratedEvent,
  PredictionPublishedEvent,
  SeasonalityDetectedEvent,
  TrendDetectedEvent,
} from '../events/forecasting.events';

export interface CreateForecastProps {
  name: string;
  forecastType: ForecastType;
  metricKey: string;
  tenantId: string;
  modelType?: ModelType;
  granularity?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';
  window?: ForecastWindow;
  description?: string;
  tags?: string[];
  createdBy?: string;
}

export class ForecastAggregate {
  private readonly id: ForecastId;
  private readonly tenantId: string;
  private definition: ForecastDefinition;
  private model: ForecastModel;
  private window: ForecastWindow;
  private status: ForecastStatus;
  private version: ForecastVersion;
  private tags: string[];
  private createdBy: string;
  private updatedBy: string;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private uncommittedEvents: BaseAnalyticsDomainEvent[] = [];

  private constructor(props: {
    id: ForecastId;
    tenantId: string;
    definition: ForecastDefinition;
    model: ForecastModel;
    window: ForecastWindow;
    status: ForecastStatus;
    version: ForecastVersion;
    tags?: string[];
    createdBy?: string;
    updatedBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.definition = props.definition;
    this.model = props.model;
    this.window = props.window;
    this.status = props.status;
    this.version = props.version;
    this.tags = props.tags || [];
    this.createdBy = props.createdBy || 'system';
    this.updatedBy = props.updatedBy || props.createdBy || 'system';
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  /**
   * Factory method to create a new Forecast Aggregate in DRAFT state
   */
  public static create(props: CreateForecastProps): ForecastAggregate {
    const id = ForecastId.create();
    const version = ForecastVersion.initial();
    const definition = ForecastDefinition.create({
      name: props.name,
      forecastType: props.forecastType,
      metricKey: props.metricKey,
      granularity: props.granularity,
      description: props.description,
    });

    const model = ForecastModel.defaultModel(props.modelType || ModelType.EXPONENTIAL_SMOOTHING);

    const now = new Date();
    const defaultEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const window = props.window || ForecastWindow.create({ startDate: now, endDate: defaultEnd, horizonPeriods: 7 });

    const aggregate = new ForecastAggregate({
      id,
      tenantId: props.tenantId,
      definition,
      model,
      window,
      status: ForecastStatus.DRAFT,
      version,
      tags: props.tags,
      createdBy: props.createdBy,
    });

    aggregate.addDomainEvent(
      new ForecastCreatedEvent(
        id.getValue(),
        props.tenantId,
        props.name,
        props.forecastType,
        model.modelType,
        version.toString()
      )
    );

    return aggregate;
  }

  /**
   * Reconstitute aggregate from persistent storage
   */
  public static reconstitute(props: {
    id: ForecastId;
    tenantId: string;
    definition: ForecastDefinition;
    model: ForecastModel;
    window: ForecastWindow;
    status: ForecastStatus;
    version: ForecastVersion;
    tags: string[];
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
  }): ForecastAggregate {
    return new ForecastAggregate(props);
  }

  // Getters
  public getId(): ForecastId {
    return this.id;
  }

  public getTenantId(): string {
    return this.tenantId;
  }

  public getDefinition(): ForecastDefinition {
    return this.definition;
  }

  public getModel(): ForecastModel {
    return this.model;
  }

  public getWindow(): ForecastWindow {
    return this.window;
  }

  public getStatus(): ForecastStatus {
    return this.status;
  }

  public getVersion(): ForecastVersion {
    return this.version;
  }

  public getTags(): string[] {
    return [...this.tags];
  }

  public getCreatedBy(): string {
    return this.createdBy;
  }

  public getUpdatedBy(): string {
    return this.updatedBy;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // State Machine Mutations
  public updateModel(model: ForecastModel, updatedBy: string = 'system'): void {
    this.model = model;
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
  }

  public updateWindow(window: ForecastWindow, updatedBy: string = 'system'): void {
    this.window = window;
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
  }

  public train(): void {
    this.status = ForecastStatus.TRAINING;
    this.updatedAt = new Date();
  }

  public markReady(): void {
    this.status = ForecastStatus.READY;
    this.updatedAt = new Date();
  }

  public publish(publishedBy: string = 'system'): void {
    this.status = ForecastStatus.PUBLISHED;
    this.updatedBy = publishedBy;
    this.updatedAt = new Date();
  }

  public archive(updatedBy: string = 'system'): void {
    this.status = ForecastStatus.ARCHIVED;
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();

    this.addDomainEvent(
      new ForecastArchivedEvent(
        this.id.getValue(),
        this.tenantId,
        this.version.toString()
      )
    );
  }

  // Domain Event Recording
  public recordForecastGenerated(
    predictionCount: number,
    confidenceScore: number,
    latencyMs: number
  ): void {
    this.addDomainEvent(
      new ForecastGeneratedEvent(
        this.id.getValue(),
        this.tenantId,
        predictionCount,
        confidenceScore,
        latencyMs
      )
    );
  }

  public recordTrend(trend: Trend): void {
    this.addDomainEvent(
      new TrendDetectedEvent(
        this.id.getValue(),
        this.tenantId,
        trend.direction,
        trend.slope,
        trend.changePercentage
      )
    );
  }

  public recordSeasonality(seasonality: SeasonalityPattern): void {
    this.addDomainEvent(
      new SeasonalityDetectedEvent(
        this.id.getValue(),
        this.tenantId,
        seasonality.periodicity,
        seasonality.seasonalityIndex
      )
    );
  }

  public recordAnomaly(anomaly: AnomalyScore): void {
    this.addDomainEvent(
      new AnomalyDetectedEvent(
        this.id.getValue(),
        this.tenantId,
        anomaly.score,
        anomaly.deviationSigma,
        anomaly.anomalyType || 'OUTLIER'
      )
    );
  }

  public recordPredictionPublished(predictionId: string, predictedValue: number, confidenceScore: number): void {
    this.addDomainEvent(
      new PredictionPublishedEvent(
        this.id.getValue(),
        this.tenantId,
        predictionId,
        predictedValue,
        confidenceScore
      )
    );
  }

  // Events Management
  private addDomainEvent(event: BaseAnalyticsDomainEvent): void {
    this.uncommittedEvents.push(event);
  }

  public getUncommittedEvents(): BaseAnalyticsDomainEvent[] {
    return [...this.uncommittedEvents];
  }

  public clearUncommittedEvents(): void {
    this.uncommittedEvents = [];
  }
}
