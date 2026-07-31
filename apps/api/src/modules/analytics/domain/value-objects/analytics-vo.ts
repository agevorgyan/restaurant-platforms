/**
 * Enterprise Analytics Foundation Platform - Domain Value Objects
 */

import { randomUUID } from 'crypto';
import { AggregationStrategy, AnalyticsType } from '../enums/analytics.enums';
import { InvalidMetricValueException } from '../exceptions/analytics.exceptions';

export class MetricId {
  private constructor(private readonly value: string) {}

  public static create(value: string): MetricId {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new InvalidMetricValueException('MetricId cannot be empty');
    }
    return new MetricId(value.trim());
  }

  public static generate(): MetricId {
    return new MetricId(randomUUID());
  }

  public getValue(): string {
    return this.value;
  }
}

export class MetricName {
  private constructor(private readonly value: string) {}

  public static create(value: string): MetricName {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new InvalidMetricValueException('MetricName cannot be empty');
    }
    return new MetricName(value.trim().toLowerCase());
  }

  public getValue(): string {
    return this.value;
  }
}

export class MetricValue {
  constructor(
    public readonly amount: number,
    public readonly unit: string = 'COUNT'
  ) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new InvalidMetricValueException('MetricValue amount must be a valid number');
    }
  }

  public static create(amount: number, unit: string = 'COUNT'): MetricValue {
    return new MetricValue(amount, unit);
  }
}

export class KpiId {
  private constructor(private readonly value: string) {}

  public static create(value: string): KpiId {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new InvalidMetricValueException('KpiId cannot be empty');
    }
    return new KpiId(value.trim());
  }

  public static generate(): KpiId {
    return new KpiId(randomUUID());
  }

  public getValue(): string {
    return this.value;
  }
}

export class KpiDefinition {
  constructor(
    public readonly kpiId: KpiId,
    public readonly name: string,
    public readonly formula: string, // e.g. "SUM(sales_usd) / COUNT(orders)"
    public readonly targetValue: number,
    public readonly warningThreshold: number
  ) {}

  public static create(name: string, formula: string, targetValue: number, warningThreshold: number): KpiDefinition {
    return new KpiDefinition(KpiId.generate(), name, formula, targetValue, warningThreshold);
  }
}

export class AggregationWindow {
  constructor(public readonly windowSize: '1m' | '5m' | '1h' | '1d') {}

  public static create(windowSize: '1m' | '5m' | '1h' | '1d' = '1h'): AggregationWindow {
    return new AggregationWindow(windowSize);
  }
}

export class TimeBucket {
  constructor(
    public readonly startTime: Date,
    public readonly endTime: Date
  ) {
    if (startTime >= endTime) {
      throw new InvalidMetricValueException('TimeBucket startTime must be before endTime');
    }
  }

  public static create(startTime: Date, endTime: Date): TimeBucket {
    return new TimeBucket(startTime, endTime);
  }
}

export class Dimension {
  constructor(
    public readonly key: string,
    public readonly value: string
  ) {}

  public static create(key: string, value: string): Dimension {
    return new Dimension(key, value);
  }
}

export class Measure {
  constructor(
    public readonly key: string,
    public readonly rawValue: number
  ) {}

  public static create(key: string, rawValue: number): Measure {
    return new Measure(key, rawValue);
  }
}

export class AnalyticsQuery {
  constructor(
    public readonly analyticsType: AnalyticsType,
    public readonly metricNames: string[],
    public readonly dimensionsFilter: Record<string, string>,
    public readonly strategy: AggregationStrategy,
    public readonly timeBucket: TimeBucket
  ) {}

  public static create(
    analyticsType: AnalyticsType,
    metricNames: string[],
    dimensionsFilter: Record<string, string> = {},
    strategy: AggregationStrategy = AggregationStrategy.SUM,
    timeBucket?: TimeBucket
  ): AnalyticsQuery {
    const defaultTime = timeBucket || TimeBucket.create(new Date(Date.now() - 3600000), new Date());
    return new AnalyticsQuery(analyticsType, metricNames, dimensionsFilter, strategy, defaultTime);
  }
}
