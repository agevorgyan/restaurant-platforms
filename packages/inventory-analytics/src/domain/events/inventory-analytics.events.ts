/**
 * Enterprise Inventory Analytics Platform - Domain Events
 *
 * Domain events emitted during metric calculation, threshold breaches, valuation changes, supplier rating updates, and reorder recommendations.
 */

import { AnalyticsWindow, MetricStatus } from '../enums/inventory-analytics.enums';

export interface InventoryMetricCalculatedEvent {
  eventName: 'InventoryMetricCalculated';
  metricName: string;
  value: number;
  window: AnalyticsWindow;
  timestamp: Date;
}

export interface InventoryThresholdExceededEvent {
  eventName: 'InventoryThresholdExceeded';
  metricName: string;
  currentValue: number;
  thresholdLimit: number;
  status: MetricStatus;
  timestamp: Date;
}

export interface InventoryValueChangedEvent {
  eventName: 'InventoryValueChanged';
  totalAssetValue: number;
  timestamp: Date;
}

export interface SupplierScoreUpdatedEvent {
  eventName: 'SupplierScoreUpdated';
  supplierId: string;
  score: number;
  timestamp: Date;
}

export interface WasteTrendDetectedEvent {
  eventName: 'WasteTrendDetected';
  wasteCategory: string;
  wastePercentage: number;
  timestamp: Date;
}

export interface ReorderRecommendationGeneratedEvent {
  eventName: 'ReorderRecommendationGenerated';
  stockItemId: string;
  recommendedQty: number;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  timestamp: Date;
}

export type InventoryAnalyticsDomainEvent =
  | InventoryMetricCalculatedEvent
  | InventoryThresholdExceededEvent
  | InventoryValueChangedEvent
  | SupplierScoreUpdatedEvent
  | WasteTrendDetectedEvent
  | ReorderRecommendationGeneratedEvent;
