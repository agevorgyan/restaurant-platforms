/**
 * Enterprise Forecasting & Predictive Analytics Platform - Value Objects
 *
 * Immutable Value Objects encapsulating forecast identity, semantic versioning, model hyperparameters,
 * prediction windows, confidence intervals, trend metrics, seasonality patterns, and anomaly scoring.
 */

import { ForecastType, ModelType } from '../enums/forecasting.enums';
import {
  InvalidForecastModelException,
  InvalidPredictionWindowException,
} from '../exceptions/forecasting.exceptions';

/**
 * ForecastId Value Object
 */
export class ForecastId {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('ForecastId cannot be empty');
    }
    this.value = value;
  }

  public static create(id?: string): ForecastId {
    return new ForecastId(id || `fcst-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
  }

  public static fromString(id: string): ForecastId {
    return new ForecastId(id);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: ForecastId): boolean {
    return this.value === other.getValue();
  }
}

/**
 * ForecastVersion Value Object
 * Semantic versioning (Major.Minor)
 */
export class ForecastVersion {
  private readonly major: number;
  private readonly minor: number;

  private constructor(major: number, minor: number) {
    if (major < 0 || minor < 0) {
      throw new Error('ForecastVersion components must be non-negative');
    }
    this.major = major;
    this.minor = minor;
  }

  public static initial(): ForecastVersion {
    return new ForecastVersion(1, 0);
  }

  public static create(major: number, minor: number): ForecastVersion {
    return new ForecastVersion(major, minor);
  }

  public incrementMinor(): ForecastVersion {
    return new ForecastVersion(this.major, this.minor + 1);
  }

  public incrementMajor(): ForecastVersion {
    return new ForecastVersion(this.major + 1, 0);
  }

  public toString(): string {
    return `${this.major}.${this.minor}`;
  }
}

/**
 * ForecastDefinition Value Object
 */
export class ForecastDefinition {
  public readonly name: string;
  public readonly forecastType: ForecastType;
  public readonly metricKey: string;
  public readonly granularity: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';
  public readonly description?: string;

  private constructor(props: {
    name: string;
    forecastType: ForecastType;
    metricKey: string;
    granularity?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';
    description?: string;
  }) {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('ForecastDefinition name cannot be empty');
    }
    if (!props.metricKey || props.metricKey.trim().length === 0) {
      throw new Error('ForecastDefinition metricKey cannot be empty');
    }
    this.name = props.name;
    this.forecastType = props.forecastType;
    this.metricKey = props.metricKey;
    this.granularity = props.granularity || 'DAY';
    this.description = props.description;
  }

  public static create(props: {
    name: string;
    forecastType: ForecastType;
    metricKey: string;
    granularity?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';
    description?: string;
  }): ForecastDefinition {
    return new ForecastDefinition(props);
  }
}

/**
 * ForecastModel Value Object
 */
export class ForecastModel {
  public readonly modelType: ModelType;
  public readonly hyperparameters: Record<string, unknown>;
  public readonly smoothingFactor: number;
  public readonly windowSize: number;
  public readonly isAiEnabled: boolean;

  private constructor(props: {
    modelType: ModelType;
    hyperparameters?: Record<string, unknown>;
    smoothingFactor?: number;
    windowSize?: number;
    isAiEnabled?: boolean;
  }) {
    this.modelType = props.modelType;
    this.hyperparameters = props.hyperparameters || {};
    this.smoothingFactor = props.smoothingFactor ?? 0.3;
    this.windowSize = props.windowSize ?? 14;
    this.isAiEnabled = props.isAiEnabled ?? (props.modelType === ModelType.AI_ASSISTED || props.modelType === ModelType.HYBRID);

    if (this.smoothingFactor < 0 || this.smoothingFactor > 1) {
      throw new InvalidForecastModelException('smoothingFactor must be between 0.0 and 1.0');
    }
    if (this.windowSize <= 0) {
      throw new InvalidForecastModelException('windowSize must be greater than zero');
    }
  }

  public static create(props: {
    modelType: ModelType;
    hyperparameters?: Record<string, unknown>;
    smoothingFactor?: number;
    windowSize?: number;
    isAiEnabled?: boolean;
  }): ForecastModel {
    return new ForecastModel(props);
  }

  public static defaultModel(modelType: ModelType = ModelType.EXPONENTIAL_SMOOTHING): ForecastModel {
    return new ForecastModel({ modelType });
  }
}

/**
 * ForecastWindow Value Object
 */
export class ForecastWindow {
  public readonly startDate: Date;
  public readonly endDate: Date;
  public readonly horizonPeriods: number;
  public readonly timeUnit: 'DAY' | 'WEEK' | 'MONTH';

  private constructor(props: {
    startDate: Date;
    endDate: Date;
    horizonPeriods?: number;
    timeUnit?: 'DAY' | 'WEEK' | 'MONTH';
  }) {
    if (props.startDate >= props.endDate) {
      throw new InvalidPredictionWindowException('startDate must be earlier than endDate');
    }
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.horizonPeriods = props.horizonPeriods ?? 7;
    this.timeUnit = props.timeUnit || 'DAY';
  }

  public static create(props: {
    startDate: Date;
    endDate: Date;
    horizonPeriods?: number;
    timeUnit?: 'DAY' | 'WEEK' | 'MONTH';
  }): ForecastWindow {
    return new ForecastWindow(props);
  }
}

/**
 * PredictionConfidence Value Object
 */
export class PredictionConfidence {
  public readonly score: number; // 0.0 to 1.0
  public readonly confidenceLevelPercentage: number; // e.g. 95
  public readonly lowerBound: number;
  public readonly upperBound: number;
  public readonly mape: number; // Mean Absolute Percentage Error

  private constructor(props: {
    score: number;
    confidenceLevelPercentage?: number;
    lowerBound: number;
    upperBound: number;
    mape?: number;
  }) {
    if (props.score < 0 || props.score > 1) {
      throw new Error('PredictionConfidence score must be between 0.0 and 1.0');
    }
    this.score = props.score;
    this.confidenceLevelPercentage = props.confidenceLevelPercentage ?? 95;
    this.lowerBound = props.lowerBound;
    this.upperBound = props.upperBound;
    this.mape = props.mape ?? 0.05;
  }

  public static create(props: {
    score: number;
    confidenceLevelPercentage?: number;
    lowerBound: number;
    upperBound: number;
    mape?: number;
  }): PredictionConfidence {
    return new PredictionConfidence(props);
  }
}

/**
 * Trend Value Object
 */
export class Trend {
  public readonly direction: 'UPWARD' | 'DOWNWARD' | 'FLAT';
  public readonly slope: number;
  public readonly acceleration: number;
  public readonly changePercentage: number;

  private constructor(props: {
    direction: 'UPWARD' | 'DOWNWARD' | 'FLAT';
    slope: number;
    acceleration?: number;
    changePercentage: number;
  }) {
    this.direction = props.direction;
    this.slope = props.slope;
    this.acceleration = props.acceleration ?? 0;
    this.changePercentage = props.changePercentage;
  }

  public static create(props: {
    direction: 'UPWARD' | 'DOWNWARD' | 'FLAT';
    slope: number;
    acceleration?: number;
    changePercentage: number;
  }): Trend {
    return new Trend(props);
  }
}

/**
 * SeasonalityPattern Value Object
 */
export class SeasonalityPattern {
  public readonly periodicity: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL';
  public readonly peakPeriods: string[];
  public readonly troughPeriods: string[];
  public readonly seasonalityIndex: number;

  private constructor(props: {
    periodicity: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL';
    peakPeriods?: string[];
    troughPeriods?: string[];
    seasonalityIndex: number;
  }) {
    this.periodicity = props.periodicity;
    this.peakPeriods = props.peakPeriods || [];
    this.troughPeriods = props.troughPeriods || [];
    this.seasonalityIndex = props.seasonalityIndex;
  }

  public static create(props: {
    periodicity: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL';
    peakPeriods?: string[];
    troughPeriods?: string[];
    seasonalityIndex: number;
  }): SeasonalityPattern {
    return new SeasonalityPattern(props);
  }
}

/**
 * AnomalyScore Value Object
 */
export class AnomalyScore {
  public readonly score: number; // 0.0 (normal) to 1.0 (extreme anomaly)
  public readonly isAnomaly: boolean;
  public readonly deviationSigma: number;
  public readonly anomalyType?: 'SPIKE' | 'DIP' | 'PATTERN_SHIFT' | 'OUTLIER';

  private constructor(props: {
    score: number;
    isAnomaly: boolean;
    deviationSigma: number;
    anomalyType?: 'SPIKE' | 'DIP' | 'PATTERN_SHIFT' | 'OUTLIER';
  }) {
    this.score = props.score;
    this.isAnomaly = props.isAnomaly;
    this.deviationSigma = props.deviationSigma;
    this.anomalyType = props.anomalyType;
  }

  public static create(props: {
    score: number;
    isAnomaly: boolean;
    deviationSigma: number;
    anomalyType?: 'SPIKE' | 'DIP' | 'PATTERN_SHIFT' | 'OUTLIER';
  }): AnomalyScore {
    return new AnomalyScore(props);
  }
}

/**
 * PredictionResult Value Object
 */
export class PredictionResult {
  public readonly predictionId: string;
  public readonly timestamp: Date;
  public readonly predictedValue: number;
  public readonly confidence: PredictionConfidence;
  public readonly trend: Trend;
  public readonly seasonality?: SeasonalityPattern;
  public readonly anomalyScore?: AnomalyScore;

  private constructor(props: {
    predictionId?: string;
    timestamp: Date;
    predictedValue: number;
    confidence: PredictionConfidence;
    trend: Trend;
    seasonality?: SeasonalityPattern;
    anomalyScore?: AnomalyScore;
  }) {
    this.predictionId = props.predictionId || `pred-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    this.timestamp = props.timestamp;
    this.predictedValue = props.predictedValue;
    this.confidence = props.confidence;
    this.trend = props.trend;
    this.seasonality = props.seasonality;
    this.anomalyScore = props.anomalyScore;
  }

  public static create(props: {
    predictionId?: string;
    timestamp: Date;
    predictedValue: number;
    confidence: PredictionConfidence;
    trend: Trend;
    seasonality?: SeasonalityPattern;
    anomalyScore?: AnomalyScore;
  }): PredictionResult {
    return new PredictionResult(props);
  }
}
