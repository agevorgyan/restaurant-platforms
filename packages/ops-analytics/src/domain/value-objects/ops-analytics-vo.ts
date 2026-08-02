/**
 * Enterprise Restaurant Operations Analytics Platform - Value Objects
 *
 * Immutable Value Objects encapsulating operational metrics, immutable snapshots, occupancy rates,
 * turnover rates, wait times, dining durations, service SLAs, guest flows, waiter loads, and KPI thresholds.
 */

import { MetricStatus, TimeWindow } from '../enums/ops-analytics.enums';

/**
 * Metric & Snapshot: OperationalMetric, MetricSnapshot, KpiThreshold
 */
export class OperationalMetric {
  public readonly name: string;
  public readonly value: number;
  public readonly unit: string;

  private constructor(name: string, value: number, unit: string) {
    this.name = name;
    this.value = value;
    this.unit = unit;
  }

  public static create(name: string, value: number, unit: string = 'count'): OperationalMetric {
    return new OperationalMetric(name, value, unit);
  }
}

export class MetricSnapshot {
  public readonly snapshotId: string;
  public readonly metric: OperationalMetric;
  public readonly timeWindow: TimeWindow;
  public readonly capturedAt: Date;

  private constructor(metric: OperationalMetric, timeWindow: TimeWindow) {
    this.snapshotId = `snap-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    this.metric = metric;
    this.timeWindow = timeWindow;
    this.capturedAt = new Date();
  }

  public static create(metric: OperationalMetric, timeWindow: TimeWindow = TimeWindow.REAL_TIME): MetricSnapshot {
    return new MetricSnapshot(metric, timeWindow);
  }
}

export class KpiThreshold {
  public readonly warningLimit: number;
  public readonly criticalLimit: number;

  private constructor(warningLimit: number, criticalLimit: number) {
    this.warningLimit = warningLimit;
    this.criticalLimit = criticalLimit;
  }

  public static create(warningLimit: number, criticalLimit: number): KpiThreshold {
    return new KpiThreshold(warningLimit, criticalLimit);
  }

  public evaluateStatus(actualValue: number, isHigherBetter: boolean = true): MetricStatus {
    if (isHigherBetter) {
      if (actualValue < this.criticalLimit) return MetricStatus.CRITICAL;
      if (actualValue < this.warningLimit) return MetricStatus.WARNING;
      return MetricStatus.HEALTHY;
    } else {
      if (actualValue > this.criticalLimit) return MetricStatus.CRITICAL;
      if (actualValue > this.warningLimit) return MetricStatus.WARNING;
      return MetricStatus.HEALTHY;
    }
  }
}

/**
 * Rates & Durations: OccupancyRate, TurnoverRate, WaitTime, DiningDuration, ServiceSLA, GuestFlow, WaiterLoad
 */
export class OccupancyRate {
  public readonly percentage: number; // 0..100

  private constructor(percentage: number) {
    this.percentage = Math.max(0, Math.min(100, Math.round(percentage)));
  }

  public static create(percentage: number): OccupancyRate {
    return new OccupancyRate(percentage);
  }
}

export class TurnoverRate {
  public readonly turnsPerHour: number;

  private constructor(turnsPerHour: number) {
    this.turnsPerHour = Math.max(0, Math.round(turnsPerHour * 100) / 100);
  }

  public static create(turnsPerHour: number): TurnoverRate {
    return new TurnoverRate(turnsPerHour);
  }
}

export class WaitTime {
  public readonly averageMinutes: number;

  private constructor(averageMinutes: number) {
    this.averageMinutes = Math.max(0, Math.round(averageMinutes));
  }

  public static create(averageMinutes: number): WaitTime {
    return new WaitTime(averageMinutes);
  }
}

export class DiningDuration {
  public readonly averageMinutes: number;

  private constructor(averageMinutes: number) {
    this.averageMinutes = Math.max(0, Math.round(averageMinutes));
  }

  public static create(averageMinutes: number): DiningDuration {
    return new DiningDuration(averageMinutes);
  }
}

export class ServiceSLA {
  public readonly targetMinutes: number;
  public readonly compliancePercentage: number;

  private constructor(targetMinutes: number, compliancePercentage: number) {
    this.targetMinutes = targetMinutes;
    this.compliancePercentage = Math.max(0, Math.min(100, Math.round(compliancePercentage)));
  }

  public static create(targetMinutes: number = 15, compliancePercentage: number = 95): ServiceSLA {
    return new ServiceSLA(targetMinutes, compliancePercentage);
  }
}

export class GuestFlow {
  public readonly hourlyThroughput: number;

  private constructor(hourlyThroughput: number) {
    this.hourlyThroughput = Math.max(0, hourlyThroughput);
  }

  public static create(hourlyThroughput: number): GuestFlow {
    return new GuestFlow(hourlyThroughput);
  }
}

export class WaiterLoad {
  public readonly tablesPerWaiter: number;

  private constructor(tablesPerWaiter: number) {
    this.tablesPerWaiter = Math.max(0, Math.round(tablesPerWaiter * 10) / 10);
  }

  public static create(tablesPerWaiter: number): WaiterLoad {
    return new WaiterLoad(tablesPerWaiter);
  }
}
