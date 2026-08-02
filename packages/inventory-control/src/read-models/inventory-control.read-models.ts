/**
 * Enterprise Inventory Control Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Inventory Count Dashboard, Variance Dashboard, Waste Dashboard,
 * Adjustment History, and Count Statistics.
 */

import { CountStatus, WasteStatus } from '../domain/enums/inventory-control.enums';

export interface InventoryCountItemReadModel {
  countId: string;
  warehouseId: string;
  countType: 'FULL' | 'CYCLE' | 'SPOT' | 'BLIND' | 'RECOUNT';
  status: CountStatus;
  linesCounted: number;
  isBlindCount: boolean;
  startedAt: string;
}

export interface InventoryCountDashboardReadModel {
  totalCountsCount: number;
  counts: InventoryCountItemReadModel[];
}

export interface VarianceItemReadModel {
  countId: string;
  stockItemId: string;
  itemName: string;
  expectedQty: number;
  actualQty: number;
  varianceQty: number;
  isBreached: boolean;
}

export interface VarianceDashboardReadModel {
  totalVariancesCount: number;
  breachedVariancesCount: number;
  variances: VarianceItemReadModel[];
}

export interface WasteItemReadModel {
  wasteId: string;
  warehouseId: string;
  stockItemId: string;
  wasteQty: number;
  reasonCategory: string;
  status: WasteStatus;
  recordedAt: string;
}

export interface WasteDashboardReadModel {
  totalWasteRecordsCount: number;
  totalWasteQuantity: number;
  records: WasteItemReadModel[];
}

export interface AdjustmentItemReadModel {
  adjustmentRef: string;
  warehouseId: string;
  stockItemId: string;
  adjustmentQty: number;
  reasonCategory: string;
  isApproved: boolean;
  decidedBy: string;
  createdAt: string;
}

export interface AdjustmentHistoryReadModel {
  totalAdjustmentsCount: number;
  adjustments: AdjustmentItemReadModel[];
}

export interface CountStatisticsReadModel {
  totalFullCounts: number;
  totalCycleCounts: number;
  totalBlindCounts: number;
  totalCompleted: number;
}
