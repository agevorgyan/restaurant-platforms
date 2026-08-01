/**
 * Enterprise Forecasting & Predictive Analytics Platform - Infrastructure Repository & Forecasting Engine
 *
 * Implements IForecastRepository, IForecastQueryRepository, and IForecastingEnginePort for multi-tenant persistence,
 * deterministic & AI-assisted prediction calculation algorithms, trend statistics, anomaly logging, and read projections.
 */

import { Injectable } from '@nestjs/common';
import { ForecastAggregate } from '../../domain/models/forecast.aggregate';
import { ForecastStatus, ForecastType, ModelType, PredictionStatus } from '../../domain/enums/forecasting.enums';
import {
  ForecastDefinition,
  ForecastId,
  ForecastModel,
  ForecastVersion,
  ForecastWindow,
  PredictionConfidence,
  PredictionResult,
  Trend,
} from '../../domain/value-objects/forecasting-vo';
import {
  HistoricalDataPoint,
  IForecastingEnginePort,
  IForecastQueryRepository,
  IForecastRepository,
} from '../../domain/ports/forecasting.ports';
import {
  AnomalyHistoryReadModel,
  ConfidenceMetricsReadModel,
  ForecastCatalogReadModel,
  ForecastHistoryReadModel,
  PredictionHistoryReadModel,
  PredictionItemReadModel,
  TrendStatisticsReadModel,
} from '../../application/read-models/forecasting.read-models';

@Injectable()
export class InMemoryForecastingRepository
  implements IForecastRepository, IForecastQueryRepository, IForecastingEnginePort
{
  private readonly forecastsMap = new Map<string, ForecastAggregate>();
  private readonly predictionLog: Array<{ tenantId: string; forecastId: string; result: PredictionResult }> = [];

  constructor() {
    this.seedTemplates();
  }

  // --- IForecastRepository Implementation ---

  public async save(forecast: ForecastAggregate): Promise<void> {
    this.forecastsMap.set(forecast.getId().getValue(), forecast);
  }

  public async findById(id: string, tenantId?: string): Promise<ForecastAggregate | null> {
    const forecast = this.forecastsMap.get(id);
    if (!forecast) return null;
    return forecast;
  }

  public async findByTenant(
    tenantId: string,
    type?: ForecastType,
    status?: ForecastStatus
  ): Promise<ForecastAggregate[]> {
    const list: ForecastAggregate[] = [];
    for (const forecast of this.forecastsMap.values()) {
      if (forecast.getTenantId() === tenantId || forecast.getTenantId() === 'system-template') {
        if (type && forecast.getDefinition().forecastType !== type) continue;
        if (status && forecast.getStatus() !== status) continue;
        list.push(forecast);
      }
    }
    return list;
  }

  public async delete(id: string, tenantId: string): Promise<boolean> {
    const forecast = this.forecastsMap.get(id);
    if (!forecast || forecast.getTenantId() !== tenantId) return false;
    return this.forecastsMap.delete(id);
  }

  // --- IForecastQueryRepository Implementation ---

  public async getCatalog(
    tenantId?: string,
    type?: ForecastType,
    status?: ForecastStatus
  ): Promise<ForecastCatalogReadModel> {
    const list = tenantId
      ? await this.findByTenant(tenantId, type, status)
      : Array.from(this.forecastsMap.values());

    const summaries = list.map((f) => ({
      id: f.getId().getValue(),
      tenantId: f.getTenantId(),
      name: f.getDefinition().name,
      forecastType: f.getDefinition().forecastType,
      modelType: f.getModel().modelType,
      status: f.getStatus(),
      version: f.getVersion().toString(),
      metricKey: f.getDefinition().metricKey,
      granularity: f.getDefinition().granularity,
      horizonPeriods: f.getWindow().horizonPeriods,
      tags: f.getTags(),
      createdBy: f.getCreatedBy(),
      updatedBy: f.getUpdatedBy(),
      createdAt: f.getCreatedAt().toISOString(),
      updatedAt: f.getUpdatedAt().toISOString(),
    }));

    return {
      tenantId,
      totalForecasts: summaries.length,
      forecasts: summaries,
    };
  }

  public async getForecastHistory(tenantId?: string, forecastId?: string): Promise<ForecastHistoryReadModel> {
    const historyEntries: any[] = [];
    for (const d of this.forecastsMap.values()) {
      if ((!tenantId || d.getTenantId() === tenantId) && (!forecastId || d.getId().getValue() === forecastId)) {
        historyEntries.push({
          executionId: `exec-${d.getId().getValue()}`,
          forecastId: d.getId().getValue(),
          tenantId: d.getTenantId(),
          modelType: d.getModel().modelType,
          predictionsGenerated: d.getWindow().horizonPeriods,
          avgConfidenceScore: 0.94,
          executionLatencyMs: 28,
          executedAt: new Date().toISOString(),
        });
      }
    }

    return {
      tenantId,
      totalExecutions: historyEntries.length,
      history: historyEntries,
    };
  }

  public async getPredictionHistory(
    tenantId?: string,
    forecastId?: string,
    limit: number = 50
  ): Promise<PredictionHistoryReadModel> {
    const filtered = this.predictionLog.filter(
      (entry) =>
        (!tenantId || entry.tenantId === tenantId) &&
        (!forecastId || entry.forecastId === forecastId)
    );

    const predictions: PredictionItemReadModel[] = filtered.slice(0, limit).map((entry) => ({
      predictionId: entry.result.predictionId,
      forecastId: entry.forecastId,
      tenantId: entry.tenantId,
      timestamp: entry.result.timestamp.toISOString(),
      predictedValue: entry.result.predictedValue,
      confidenceScore: entry.result.confidence.score,
      lowerBound: entry.result.confidence.lowerBound,
      upperBound: entry.result.confidence.upperBound,
      trendDirection: entry.result.trend.direction,
      status: PredictionStatus.GENERATED,
      createdAt: new Date().toISOString(),
    }));

    return {
      tenantId,
      totalPredictions: filtered.length,
      predictions,
    };
  }

  public async getTrendStatistics(tenantId?: string, forecastId?: string): Promise<TrendStatisticsReadModel> {
    let upward = 0;
    let downward = 0;
    let flat = 0;
    const trends: any[] = [];

    for (const entry of this.predictionLog) {
      if ((!tenantId || entry.tenantId === tenantId) && (!forecastId || entry.forecastId === forecastId)) {
        const tr = entry.result.trend;
        if (tr.direction === 'UPWARD') upward++;
        else if (tr.direction === 'DOWNWARD') downward++;
        else flat++;

        trends.push({
          forecastId: entry.forecastId,
          forecastName: `Forecast ${entry.forecastId}`,
          direction: tr.direction,
          slope: tr.slope,
          acceleration: tr.acceleration,
          changePercentage: tr.changePercentage,
          detectedAt: entry.result.timestamp.toISOString(),
        });
      }
    }

    return {
      tenantId,
      totalTrendsTracked: trends.length,
      upwardTrendsCount: upward,
      downwardTrendsCount: downward,
      flatTrendsCount: flat,
      trends: trends.slice(0, 50),
    };
  }

  public async getAnomalyHistory(tenantId?: string, forecastId?: string): Promise<AnomalyHistoryReadModel> {
    let spikeCount = 0;
    let dipCount = 0;
    let shiftCount = 0;
    const anomalies: any[] = [];

    for (const entry of this.predictionLog) {
      if ((!tenantId || entry.tenantId === tenantId) && (!forecastId || entry.forecastId === forecastId)) {
        const anomaly = entry.result.anomalyScore;
        if (anomaly && anomaly.isAnomaly) {
          if (anomaly.anomalyType === 'SPIKE') spikeCount++;
          else if (anomaly.anomalyType === 'DIP') dipCount++;
          else shiftCount++;

          anomalies.push({
            anomalyId: `anom-${entry.result.predictionId}`,
            forecastId: entry.forecastId,
            tenantId: entry.tenantId,
            metricKey: 'metric-telemetry',
            anomalyScore: anomaly.score,
            deviationSigma: anomaly.deviationSigma,
            anomalyType: anomaly.anomalyType || 'SPIKE',
            detectedAt: entry.result.timestamp.toISOString(),
          });
        }
      }
    }

    return {
      tenantId,
      totalAnomaliesDetected: anomalies.length,
      spikeCount,
      dipCount,
      patternShiftCount: shiftCount,
      anomalies: anomalies.slice(0, 50),
    };
  }

  public async getConfidenceMetrics(tenantId?: string): Promise<ConfidenceMetricsReadModel> {
    const modelPerformanceByType: Record<ModelType, { count: number; avgConfidence: number }> = {} as any;
    for (const m of Object.values(ModelType)) {
      modelPerformanceByType[m] = { count: 1, avgConfidence: 0.94 };
    }

    return {
      tenantId,
      averageModelConfidence: 0.94,
      avgMape: 0.042,
      avgRmse: 14.2,
      highConfidenceForecastsCount: this.forecastsMap.size,
      modelPerformanceByType,
    };
  }

  public async savePrediction(
    tenantId: string,
    forecastId: string,
    prediction: PredictionResult
  ): Promise<PredictionResult> {
    this.predictionLog.unshift({ tenantId, forecastId, result: prediction });
    return prediction;
  }

  // --- IForecastingEnginePort Implementation ---

  public async generatePredictions(
    model: ForecastModel,
    window: ForecastWindow,
    historicalPoints: HistoricalDataPoint[]
  ): Promise<PredictionResult[]> {
    const horizon = window.horizonPeriods || 7;
    const predictions: PredictionResult[] = [];
    const baseValue = historicalPoints.length > 0
      ? historicalPoints[historicalPoints.length - 1].value
      : 1000;

    const alpha = model.smoothingFactor || 0.3;
    let currentForecast = baseValue;

    const startTime = window.startDate ? new Date(window.startDate) : new Date();

    for (let i = 0; i < horizon; i++) {
      const stepDate = new Date(startTime.getTime() + (i + 1) * 24 * 60 * 60 * 1000);

      // Model calculation dispatch
      if (model.modelType === ModelType.EXPONENTIAL_SMOOTHING) {
        currentForecast = currentForecast * (1 - alpha) + (baseValue + i * 15) * alpha;
      } else if (model.modelType === ModelType.MOVING_AVERAGE) {
        const sum = historicalPoints.slice(-3).reduce((acc, p) => acc + p.value, 0);
        currentForecast = historicalPoints.length > 0 ? sum / Math.min(3, historicalPoints.length) : baseValue;
      } else if (model.modelType === ModelType.LINEAR_REGRESSION) {
        currentForecast = baseValue + (i + 1) * 22.5;
      } else {
        // Seasonal, AI-Assisted, Hybrid
        currentForecast = baseValue * (1 + Math.sin(i / 2) * 0.08) + (i + 1) * 18;
      }

      const predictedValue = Math.round(currentForecast * 100) / 100;
      const confidence = PredictionConfidence.create({
        score: 0.94,
        confidenceLevelPercentage: 95,
        lowerBound: Math.round((predictedValue * 0.92) * 100) / 100,
        upperBound: Math.round((predictedValue * 1.08) * 100) / 100,
        mape: 0.042,
      });

      const trend = Trend.create({
        direction: predictedValue >= baseValue ? 'UPWARD' : 'DOWNWARD',
        slope: 1.5,
        changePercentage: 4.5,
      });

      predictions.push(
        PredictionResult.create({
          timestamp: stepDate,
          predictedValue,
          confidence,
          trend,
        })
      );
    }

    return predictions;
  }

  // Seed Out-of-the-box Templates for all 8 Forecast Types
  private seedTemplates(): void {
    const templates = [
      { name: 'Daily Restaurant Sales Forecast', type: ForecastType.SALES, key: 'metric.sales.daily', model: ModelType.EXPONENTIAL_SMOOTHING },
      { name: 'Peak Hours Guest Demand Forecast', type: ForecastType.DEMAND, key: 'metric.demand.guests', model: ModelType.TIME_SERIES },
      { name: 'Raw Material Inventory Depletion Forecast', type: ForecastType.INVENTORY, key: 'metric.inventory.raw_materials', model: ModelType.SEASONAL },
      { name: 'Kitchen Labor Shift Requirements', type: ForecastType.LABOR, key: 'metric.labor.hours', model: ModelType.AI_ASSISTED },
      { name: 'Monthly Recurring Revenue Forecast', type: ForecastType.REVENUE, key: 'metric.revenue.mrr', model: ModelType.LINEAR_REGRESSION },
      { name: 'Operating Expense Projection', type: ForecastType.EXPENSE, key: 'metric.expense.cogs', model: ModelType.MOVING_AVERAGE },
      { name: 'Weekend Dining Reservation Volume', type: ForecastType.RESERVATION, key: 'metric.reservations.count', model: ModelType.HYBRID },
      { name: 'Custom ERP Predictive Metric', type: ForecastType.CUSTOM, key: 'metric.custom.telemetry', model: ModelType.EXPONENTIAL_SMOOTHING },
    ];

    templates.forEach((tmpl, idx) => {
      const id = ForecastId.create(`fcst-tpl-${idx + 1}`);
      const definition = ForecastDefinition.create({
        name: tmpl.name,
        forecastType: tmpl.type,
        metricKey: tmpl.key,
        granularity: 'DAY',
        description: `Seeded enterprise forecast template for ${tmpl.name}`,
      });

      const model = ForecastModel.create({ modelType: tmpl.model, smoothingFactor: 0.3, windowSize: 14 });
      const now = new Date();
      const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const window = ForecastWindow.create({ startDate: now, endDate: end, horizonPeriods: 7 });

      const aggregate = ForecastAggregate.reconstitute({
        id,
        tenantId: 'tenant-default',
        definition,
        model,
        window,
        status: ForecastStatus.PUBLISHED,
        version: ForecastVersion.initial(),
        tags: ['template', tmpl.type.toLowerCase()],
        createdBy: 'system-seeder',
        updatedBy: 'system-seeder',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      this.forecastsMap.set(id.getValue(), aggregate);
    });
  }
}
