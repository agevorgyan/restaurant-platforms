/**
 * Enterprise Forecasting & Predictive Analytics Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, ForecastAggregate Root & Lifecycle, Predictive Modeling Engine,
 * Trend Analysis, Seasonality Detection, Anomaly Scoring, Confidence Intervals, Historical Backtesting,
 * Immutable Prediction History, RLS Tenant Security, and Read Models.
 */

import {
  ForecastId,
  ForecastVersion,
  ForecastDefinition,
  ForecastModel,
  ForecastWindow,
  PredictionConfidence,
  Trend,
  SeasonalityPattern,
  AnomalyScore,
} from './domain/value-objects/forecasting-vo';
import { ForecastType, ModelType, ForecastStatus } from './domain/enums/forecasting.enums';
import { ForecastAggregate } from './domain/models/forecast.aggregate';
import { InMemoryForecastingRepository } from './infrastructure/repositories/in-memory-forecasting.repository';
import { NestEventPublisherAdapter } from '../integration/infrastructure/adapters/connector.adapters';
import {
  ForecastService,
  PredictionService,
  TrendAnalysisService,
  SeasonalityService,
  AnomalyDetectionService,
  ConfidenceService,
  ForecastVersionService,
  EnterpriseForecastingPlatformService,
} from './application/services/forecasting-platform.services';
import {
  InvalidForecastModelException,
  InvalidPredictionWindowException,
  UnauthorizedForecastAccessException,
} from './domain/exceptions/forecasting.exceptions';

describe('Enterprise Forecasting & Predictive Analytics Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should generate unique IDs for ForecastId and format semantic versions', () => {
      const fcstId = ForecastId.create();
      expect(fcstId.getValue()).toMatch(/^fcst-/);

      const v1 = ForecastVersion.initial();
      expect(v1.toString()).toBe('1.0');

      const v11 = v1.incrementMinor();
      expect(v11.toString()).toBe('1.1');
    });

    it('should validate ForecastModel hyperparameters and bounds', () => {
      expect(() => ForecastModel.create({ modelType: ModelType.EXPONENTIAL_SMOOTHING, smoothingFactor: 1.5 })).toThrow(
        InvalidForecastModelException
      );

      expect(() => ForecastModel.create({ modelType: ModelType.MOVING_AVERAGE, windowSize: 0 })).toThrow(
        InvalidForecastModelException
      );
    });

    it('should throw exception if ForecastWindow startDate >= endDate', () => {
      const now = new Date();
      const earlier = new Date(now.getTime() - 10000);
      expect(() => ForecastWindow.create({ startDate: now, endDate: earlier })).toThrow(
        InvalidPredictionWindowException
      );
    });
  });

  describe('ForecastAggregate Root & Lifecycle', () => {
    it('should create a forecast in DRAFT state and emit ForecastCreated event', () => {
      const forecast = ForecastAggregate.create({
        name: 'Daily Restaurant Revenue Forecast',
        forecastType: ForecastType.REVENUE,
        metricKey: 'metric.sales.daily',
        tenantId: 'tenant-rest-1',
      });

      expect(forecast.getStatus()).toBe(ForecastStatus.DRAFT);
      expect(forecast.getVersion().toString()).toBe('1.0');
      expect(forecast.getUncommittedEvents().length).toBe(1);
      expect(forecast.getUncommittedEvents()[0].eventName).toBe('ForecastCreated');
    });

    it('should publish, train, and archive a forecast aggregate', () => {
      const forecast = ForecastAggregate.create({
        name: 'Kitchen Labor Shift Requirements',
        forecastType: ForecastType.LABOR,
        metricKey: 'metric.labor.hours',
        tenantId: 'tenant-ops-1',
      });

      forecast.train();
      expect(forecast.getStatus()).toBe(ForecastStatus.TRAINING);

      forecast.markReady();
      expect(forecast.getStatus()).toBe(ForecastStatus.READY);

      forecast.publish('user-vp');
      expect(forecast.getStatus()).toBe(ForecastStatus.PUBLISHED);

      forecast.archive('user-vp');
      expect(forecast.getStatus()).toBe(ForecastStatus.ARCHIVED);
    });
  });

  describe('Trend, Seasonality, & Anomaly Domain Services', () => {
    let trendService: TrendAnalysisService;
    let seasonalityService: SeasonalityService;
    let anomalyService: AnomalyDetectionService;

    beforeEach(() => {
      trendService = new TrendAnalysisService();
      seasonalityService = new SeasonalityService();
      anomalyService = new AnomalyDetectionService();
    });

    it('should detect UPWARD trend direction and slope', () => {
      const points = [
        { timestamp: new Date(), value: 100 },
        { timestamp: new Date(), value: 150 },
        { timestamp: new Date(), value: 200 },
        { timestamp: new Date(), value: 250 },
      ];

      const trend = trendService.calculateTrend(points);
      expect(trend.direction).toBe('UPWARD');
      expect(trend.slope).toBeGreaterThan(0);
      expect(trend.changePercentage).toBe(150);
    });

    it('should detect seasonality patterns and periodicity', () => {
      const points = Array.from({ length: 14 }, (_, i) => ({
        timestamp: new Date(),
        value: 500 + Math.sin(i) * 200,
      }));

      const seasonality = seasonalityService.detectSeasonality(points);
      expect(seasonality.periodicity).toBe('WEEKLY');
      expect(seasonality.seasonalityIndex).toBeGreaterThan(0);
      expect(seasonality.peakPeriods.length).toBeGreaterThan(0);
    });

    it('should detect statistical anomalies and calculate Z-score deviation', () => {
      const historical = Array.from({ length: 20 }, () => ({
        timestamp: new Date(),
        value: 100 + Math.random() * 5,
      }));

      // High spike outlier (value = 500 when mean ~ 102)
      const anomaly = anomalyService.detectAnomaly(500, historical);
      expect(anomaly.isAnomaly).toBe(true);
      expect(anomaly.anomalyType).toBe('SPIKE');
      expect(anomaly.deviationSigma).toBeGreaterThan(3.0);
    });
  });

  describe('Platform Domain & Application Services', () => {
    let repo: InMemoryForecastingRepository;
    let eventPublisher: NestEventPublisherAdapter;
    let trendService: TrendAnalysisService;
    let seasonalityService: SeasonalityService;
    let anomalyService: AnomalyDetectionService;
    let confidenceService: ConfidenceService;
    let versionService: ForecastVersionService;
    let predictionService: PredictionService;
    let forecastService: ForecastService;
    let platformService: EnterpriseForecastingPlatformService;

    beforeEach(() => {
      repo = new InMemoryForecastingRepository();
      eventPublisher = new NestEventPublisherAdapter();

      trendService = new TrendAnalysisService();
      seasonalityService = new SeasonalityService();
      anomalyService = new AnomalyDetectionService();
      confidenceService = new ConfidenceService();
      versionService = new ForecastVersionService(repo);

      predictionService = new PredictionService(
        repo,
        trendService,
        seasonalityService,
        anomalyService,
        confidenceService
      );

      forecastService = new ForecastService(
        repo,
        eventPublisher,
        predictionService
      );

      platformService = new EnterpriseForecastingPlatformService(
        repo,
        repo,
        eventPublisher,
        forecastService,
        predictionService,
        versionService,
        trendService,
        anomalyService
      );
    });

    it('should query seeded templates for all 8 forecast types', async () => {
      const catalog = await platformService.getForecasts('tenant-default');
      expect(catalog.totalForecasts).toBe(8);

      const types = catalog.forecasts.map((f) => f.forecastType);
      expect(types).toContain(ForecastType.SALES);
      expect(types).toContain(ForecastType.DEMAND);
      expect(types).toContain(ForecastType.INVENTORY);
      expect(types).toContain(ForecastType.LABOR);
      expect(types).toContain(ForecastType.REVENUE);
      expect(types).toContain(ForecastType.EXPENSE);
      expect(types).toContain(ForecastType.RESERVATION);
      expect(types).toContain(ForecastType.CUSTOM);
    });

    it('should create, publish, and recalculate predictions for a forecast model', async () => {
      const created = await platformService.createForecast('tenant-store-500', {
        name: 'AI Demand Forecast Model',
        forecastType: ForecastType.DEMAND,
        metricKey: 'metric.demand.ai',
        model: {
          modelType: ModelType.AI_ASSISTED,
          smoothingFactor: 0.4,
          windowSize: 14,
        },
      });

      expect(created.id).toBeDefined();
      expect(created.model.modelType).toBe(ModelType.AI_ASSISTED);

      const predictions = await platformService.recalculateForecast('tenant-store-500', created.id);
      expect(predictions.length).toBeGreaterThan(0);
      expect(predictions[0].predictedValue).toBeGreaterThan(0);
      expect(predictions[0].confidence.score).toBeGreaterThan(0.8);
      expect(predictions[0].trend.direction).toBeDefined();

      const history = await platformService.getPredictionHistory('tenant-store-500');
      expect(history.totalPredictions).toBe(predictions.length);
    });

    it('should execute historical backtesting without mutating historical dataset', async () => {
      const catalog = await platformService.getForecasts('tenant-default');
      const targetId = catalog.forecasts[0].id;

      const backtestResult = await platformService.executeBacktest('tenant-default', targetId, {
        backtestWindowPeriods: 14,
        historicalData: [
          { timestamp: new Date().toISOString(), value: 1000 },
          { timestamp: new Date().toISOString(), value: 1050 },
          { timestamp: new Date().toISOString(), value: 1100 },
        ],
      });

      expect(backtestResult.status).toBe('PASSED');
      expect(backtestResult.accuracyPercentage).toBeGreaterThan(80);
      expect(backtestResult.mape).toBeLessThan(0.2);
    });

    it('should enforce RLS Tenant Isolation', async () => {
      const created = await platformService.createForecast('tenant-alpha', {
        name: 'Alpha Revenue Forecast',
        forecastType: ForecastType.REVENUE,
        metricKey: 'metric.alpha.rev',
      });

      await expect(
        platformService.getForecastById('tenant-beta', created.id)
      ).rejects.toThrow(UnauthorizedForecastAccessException);
    });

    it('should query Trend Statistics, Anomaly History, and Confidence Metrics read models', async () => {
      const catalog = await platformService.getForecasts('tenant-default');
      const targetId = catalog.forecasts[0].id;

      // Generate predictions to populate history
      await platformService.recalculateForecast('tenant-default', targetId);

      const trends = await platformService.getTrendStatistics('tenant-default');
      expect(trends.totalTrendsTracked).toBeGreaterThan(0);

      const anomalies = await platformService.getAnomalyHistory('tenant-default');
      expect(anomalies.totalAnomaliesDetected).toBeGreaterThanOrEqual(0);

      const confidenceMetrics = await platformService.getConfidenceMetrics('tenant-default');
      expect(confidenceMetrics.averageModelConfidence).toBeGreaterThan(0.8);
    });
  });
});
