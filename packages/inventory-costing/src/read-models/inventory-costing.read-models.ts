/**
 * Enterprise Inventory Valuation & Costing Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Inventory Value Dashboard, Cost Layer Overview, Average Cost History,
 * Cost Allocation Report, and Inventory Valuation Report.
 */

import { CostStatus, ValuationMethod } from '../domain/enums/inventory-costing.enums';

export interface CostLayerSummaryReadModel {
  layerId: string;
  stockItemId: string;
  initialQuantity: number;
  remainingQuantity: number;
  unitCost: number;
  totalLayerValue: number;
  status: CostStatus;
  createdAt: string;
}

export interface InventoryValueItemReadModel {
  stockItemId: string;
  itemName: string;
  totalQuantityOnHand: number;
  valuationMethod: ValuationMethod;
  unitCost: number;
  totalAssetValue: number;
}

export interface InventoryValueDashboardReadModel {
  totalInventoryAssetValue: number;
  totalValuedItemsCount: number;
  items: InventoryValueItemReadModel[];
}

export interface CostLayerOverviewReadModel {
  totalLayersCount: number;
  layers: CostLayerSummaryReadModel[];
}

export interface AverageCostHistoryItemReadModel {
  stockItemId: string;
  averageCost: number;
  timestamp: string;
}

export interface AverageCostHistoryReadModel {
  history: AverageCostHistoryItemReadModel[];
}

export interface CostAllocationItemReadModel {
  layerId: string;
  allocatedLandedCost: number;
  basis: string;
}

export interface CostAllocationReportReadModel {
  totalLandedCostAllocated: number;
  allocations: CostAllocationItemReadModel[];
}

export interface InventoryValuationReportReadModel {
  methodUsed: ValuationMethod;
  generatedAt: string;
  totalAssetValue: number;
  itemsSummary: InventoryValueItemReadModel[];
}
