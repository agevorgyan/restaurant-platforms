/**
 * Enterprise Inventory Analytics Platform - Value Objects
 *
 * Immutable Value Objects encapsulating inventory metrics, snapshots, turnover, days on hand,
 * fill rates, stock accuracy, waste rates, supplier scores, valuation metrics, and KPI thresholds.
 */

import { AnalyticsWindow, MetricStatus } from '../enums/inventory-analytics.enums';

/**
 * Metric & Snapshot: InventoryMetric, MetricSnapshot, KpiThreshold
 */
export class InventoryMetric {
  public readonly name: string;
  public readonly value: number;
  public readonly unit: string;

  private constructor(name: string, value: number, unit: string) {
    this.name = name;
    this.value = Math.round(value * 100) / 100;
    this.unit = unit;
  }

  public static create(name: string, value: number, unit: string = 'ratio'): InventoryMetric {
    return new InventoryMetric(name, value, unit);
  }
}

export class MetricSnapshot {
  public readonly snapshotId: string;
  public readonly metric: InventoryMetric;
  public readonly window: AnalyticsWindow;
  public readonly capturedAt: Date;

  private constructor(metric: InventoryMetric, window: AnalyticsWindow) {
    this.snapshotId = `isnap-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    this.metric = metric;
    this.window = window;
    this.capturedAt = new Date();
  }

  public static create(metric: InventoryMetric, window: AnalyticsWindow = AnalyticsWindow.REAL_TIME): MetricSnapshot {
    return new MetricSnapshot(metric, window);
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
 * Specific KPI Ratios: InventoryTurnover, DaysOnHand, FillRate, StockAccuracy, WasteRate, SupplierScore, InventoryValueMetric
 */
export class InventoryTurnover {
  public readonly ratio: number;

  private constructor(ratio: number) {
    this.ratio = Math.max(0, Math.round(ratio * 100) / 100);
  }

  public static create(cogsTotal: number, averageInventoryValue: number): InventoryTurnover {
    const ratio = averageInventoryValue > 0 ? cogsTotal / averageInventoryValue : 0;
    return new InventoryTurnover(ratio);
  }
}

export class DaysOnHand {
  public readonly days: number;

  private constructor(days: number) {
    this.days = Math.max(0, Math.round(days * 10) / 10);
  }

  public static create(turnoverRatio: number): DaysOnHand {
    const days = turnoverRatio > 0 ? 365 / turnoverRatio : 365;
    return new DaysOnHand(days);
  }
}

export class FillRate {
  public readonly percentage: number;

  private constructor(percentage: number) {
    this.percentage = Math.max(0, Math.min(100, Math.round(percentage)));
  }

  public static create(fulfilledOrders: number, totalOrders: number): FillRate {
    const rate = totalOrders > 0 ? (fulfilledOrders / totalOrders) * 100 : 100;
    return new FillRate(rate);
  }
}

export class StockAccuracy {
  public readonly percentage: number;

  private constructor(percentage: number) {
    this.percentage = Math.max(0, Math.min(100, Math.round(percentage)));
  }

  public static create(accurateCountLines: number, totalCountLines: number): StockAccuracy {
    const acc = totalCountLines > 0 ? (accurateCountLines / totalCountLines) * 100 : 100;
    return new StockAccuracy(acc);
  }
}

export class WasteRate {
  public readonly percentage: number;

  private constructor(percentage: number) {
    this.percentage = Math.max(0, Math.min(100, Math.round(percentage * 10) / 10));
  }

  public static create(wasteCostTotal: number, totalCostOfGoods: number): WasteRate {
    const rate = totalCostOfGoods > 0 ? (wasteCostTotal / totalCostOfGoods) * 100 : 0;
    return new WasteRate(rate);
  }
}

export class SupplierScore {
  public readonly ratingScore: number; // 0..5

  private constructor(ratingScore: number) {
    this.ratingScore = Math.max(0, Math.min(5, Math.round(ratingScore * 10) / 10));
  }

  public static create(ratingScore: number): SupplierScore {
    return new SupplierScore(ratingScore);
  }
}

export class InventoryValueMetric {
  public readonly totalAssetValue: number;

  private constructor(totalAssetValue: number) {
    this.totalAssetValue = Math.max(0, Math.round(totalAssetValue * 100) / 100);
  }

  public static create(totalAssetValue: number): InventoryValueMetric {
    return new InventoryValueMetric(totalAssetValue);
  }
}
