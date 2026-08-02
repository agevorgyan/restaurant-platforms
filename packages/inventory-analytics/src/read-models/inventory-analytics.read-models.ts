/**
 * Enterprise Inventory Analytics Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Inventory Dashboard, Warehouse Dashboard, Supplier Dashboard,
 * Waste Dashboard, Inventory Value Dashboard, and Replenishment Dashboard.
 */

import { AnalyticsWindow, MetricStatus } from '../domain/enums/inventory-analytics.enums';

export interface KpiMetricItemReadModel {
  kpiName: string;
  value: number;
  unit: string;
  status: MetricStatus;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface InventoryDashboardReadModel {
  window: AnalyticsWindow;
  inventoryTurnoverRatio: number;
  daysOnHand: number;
  stockAccuracyPercentage: number;
  fillRatePercentage: number;
  totalAssetValue: number;
  kpis: KpiMetricItemReadModel[];
}

export interface WarehouseDashboardReadModel {
  totalActiveWarehousesCount: number;
  totalStorageCapacityUtilization: number;
  warehouseMetrics: Array<{ warehouseId: string; name: string; itemsCount: number; fillRate: number }>;
}

export interface SupplierDashboardReadModel {
  totalSuppliersCount: number;
  averageSupplierRating: number;
  receivingAccuracyPercentage: number;
  topSuppliers: Array<{ supplierId: string; supplierName: string; ratingScore: number; onTimeDeliveryRate: number }>;
}

export interface WasteDashboardReadModel {
  totalWasteCost: number;
  wastePercentageOfCogs: number;
  shrinkagePercentage: number;
  wasteByCategory: Array<{ category: string; wasteCost: number }>;
}

export interface InventoryValueDashboardReadModel {
  totalValuedAssetAmount: number;
  cogsPeriodTotal: number;
  topAssetCategories: Array<{ categoryName: string; totalValue: number }>;
}

export interface ReplenishmentRecommendationItemReadModel {
  stockItemId: string;
  sku: string;
  itemName: string;
  currentStock: number;
  reorderPoint: number;
  recommendedOrderQty: number;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ReplenishmentDashboardReadModel {
  totalItemsNeedingReplenishment: number;
  recommendations: ReplenishmentRecommendationItemReadModel[];
}
