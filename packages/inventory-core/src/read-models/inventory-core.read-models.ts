/**
 * Enterprise Inventory Core Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Inventory Catalog, Category Overview, Storage Overview,
 * Reorder Dashboard, and Inventory Statistics.
 */

import { InventoryItemStatus, InventoryType } from '../domain/enums/inventory-core.enums';

export interface InventoryCatalogItemReadModel {
  stockItemId: string;
  sku: string;
  barcode: string;
  itemName: string;
  inventoryType: InventoryType;
  unitOfMeasure: string;
  reorderPointQuantity: number;
  safetyStockQuantity: number;
  currentStockQuantity: number;
  storageLocationName: string;
  shelfLifeDays: number;
  status: InventoryItemStatus;
  createdAt: string;
}

export interface InventoryCatalogReadModel {
  totalItemsCount: number;
  items: InventoryCatalogItemReadModel[];
}

export interface CategorySummaryItemReadModel {
  inventoryType: InventoryType;
  itemsCount: number;
}

export interface CategoryOverviewReadModel {
  categories: CategorySummaryItemReadModel[];
}

export interface StorageLocationSummaryReadModel {
  locationId: string;
  zoneName: string;
  itemsCount: number;
}

export interface StorageOverviewReadModel {
  locations: StorageLocationSummaryReadModel[];
}

export interface ReorderItemReadModel {
  stockItemId: string;
  sku: string;
  itemName: string;
  currentStock: number;
  reorderPoint: number;
  safetyStock: number;
  recommendedReorderQty: number;
}

export interface ReorderDashboardReadModel {
  itemsNeedingReorderCount: number;
  items: ReorderItemReadModel[];
}

export interface InventoryStatisticsReadModel {
  totalActiveItems: number;
  totalInactiveItems: number;
  totalBlockedItems: number;
  totalArchivedItems: number;
}
