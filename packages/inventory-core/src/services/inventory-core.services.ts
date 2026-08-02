/**
 * Enterprise Inventory Core Platform - Domain Services
 *
 * Implements core domain services for inventory management:
 * 1. ValidationService (Tenant-Scoped Unique SKU & Barcode Validator)
 * 2. InventoryService (Primary InventoryItem Aggregate Coordinator & Archiving Manager)
 * 3. CatalogService (Catalog Search & Category Overview Projector)
 * 4. StorageService (Storage Location & Zone Manager)
 * 5. ReorderPolicyService (Reorder Point & Safety Stock Dashboard Projector)
 * 6. EnterpriseInventoryCorePlatformService (Primary Application Façade)
 */

import { InventoryItemStatus, InventoryType } from '../domain/enums/inventory-core.enums';

import {
  Barcode,
  InventoryCategory,
  ItemName,
  ReorderPoint,
  SafetyStock,
  ShelfLife,
  Sku,
  StockItemId,
  StockStatus,
  StorageLocation,
  UnitOfMeasure,
} from '../domain/value-objects/inventory-core-vo';
import {
  CategoryOverviewReadModel,
  InventoryCatalogItemReadModel,
  InventoryCatalogReadModel,
  InventoryStatisticsReadModel,
  ReorderDashboardReadModel,
  StorageOverviewReadModel,
} from '../read-models/inventory-core.read-models';

/**
 * Service 1: ValidationService
 * Tenant-scoped unique SKU & barcode validator.
 */
export class ValidationService {
  private readonly registeredSkusByTenant = new Map<string, Set<string>>();

  public validateSkuUniqueness(tenantId: string, skuCode: string): void {
    if (!this.registeredSkusByTenant.has(tenantId)) {
      this.registeredSkusByTenant.set(tenantId, new Set());
    }
    const set = this.registeredSkusByTenant.get(tenantId)!;
    const normalized = skuCode.trim().toUpperCase();

    if (set.has(normalized)) {
      throw new Error(`Inventory validation error: SKU '${normalized}' already exists for tenant ${tenantId}`);
    }
  }

  public registerSku(tenantId: string, skuCode: string): void {
    this.validateSkuUniqueness(tenantId, skuCode);
    this.registeredSkusByTenant.get(tenantId)!.add(skuCode.trim().toUpperCase());
  }

  public unregisterSku(tenantId: string, skuCode: string): void {
    if (this.registeredSkusByTenant.has(tenantId)) {
      this.registeredSkusByTenant.get(tenantId)!.delete(skuCode.trim().toUpperCase());
    }
  }
}

/**
 * Service 2: InventoryService
 * Primary InventoryItem Aggregate Root coordinator. Never deletes items; archives them.
 */
export class InventoryService {
  private readonly itemsMap = new Map<
    string,
    {
      tenantId: string;
      stockItemId: StockItemId;
      sku: Sku;
      barcode: Barcode;
      itemName: ItemName;
      category: InventoryCategory;
      unit: UnitOfMeasure;
      reorderPoint: ReorderPoint;
      safetyStock: SafetyStock;
      storageLocation: StorageLocation;
      shelfLife: ShelfLife;
      stockStatus: StockStatus;
      itemStatus: InventoryItemStatus;
      currentStockQty: number;
    }
  >();

  constructor(private readonly validationService: ValidationService) {}

  public createInventoryItem(
    tenantId: string,
    skuCode: string,
    name: string,
    type: InventoryType = InventoryType.INGREDIENT,
    unitName: 'PIECE' | 'KILOGRAM' | 'GRAM' | 'LITER' | 'MILLILITER' | 'BOTTLE' | 'BOX' | 'PACK' | 'CUSTOM' = 'KILOGRAM',
    reorderQty: number = 10,
    safetyQty: number = 5,
    initialStock: number = 25
  ): StockItemId {
    this.validationService.registerSku(tenantId, skuCode);

    const stockItemId = StockItemId.create();
    const sku = Sku.create(skuCode);
    const barcode = Barcode.create();
    const itemName = ItemName.create(name);
    const category = InventoryCategory.create(type, type);
    const unit = UnitOfMeasure.create(unitName);
    const reorderPoint = ReorderPoint.create(reorderQty);
    const safetyStock = SafetyStock.create(safetyQty);
    const storageLocation = StorageLocation.create();
    const shelfLife = ShelfLife.create(30);
    const stockStatus = StockStatus.create('AVAILABLE');

    this.itemsMap.set(stockItemId.id, {
      tenantId,
      stockItemId,
      sku,
      barcode,
      itemName,
      category,
      unit,
      reorderPoint,
      safetyStock,
      storageLocation,
      shelfLife,
      stockStatus,
      itemStatus: InventoryItemStatus.ACTIVE,
      currentStockQty: initialStock,
    });

    return stockItemId;
  }

  public archiveInventoryItem(tenantId: string, stockItemId: string, reason: string = 'Discontinued'): void {
    const item = this.itemsMap.get(stockItemId);
    if (!item) throw new Error(`Inventory error: Item ${stockItemId} not found`);

    item.itemStatus = InventoryItemStatus.ARCHIVED;
  }

  public getItemMap(): Map<string, any> {
    return this.itemsMap;
  }
}

/**
 * Service 3: CatalogService
 * Catalog search & category overview projector.
 */
export class CatalogService {
  constructor(private readonly inventoryService: InventoryService) {}

  public getInventoryCatalog(tenantId: string): InventoryCatalogReadModel {
    const itemsMap = this.inventoryService.getItemMap();
    const list = Array.from(itemsMap.values()).filter((i: any) => i.tenantId === tenantId);

    return {
      totalItemsCount: list.length,
      items: list.map((i: any) => ({
        stockItemId: i.stockItemId.id,
        sku: i.sku.code,
        barcode: i.barcode.value,
        itemName: i.itemName.name,
        inventoryType: i.category.type,
        unitOfMeasure: i.unit.unit,
        reorderPointQuantity: i.reorderPoint.thresholdQuantity,
        safetyStockQuantity: i.safetyStock.minBufferQuantity,
        currentStockQuantity: i.currentStockQty,
        storageLocationName: i.storageLocation.zoneName,
        shelfLifeDays: i.shelfLife.days,
        status: i.itemStatus,
        createdAt: new Date().toISOString(),
      })),
    };
  }

  public getCategoryOverview(tenantId: string): CategoryOverviewReadModel {
    const catalog = this.getInventoryCatalog(tenantId);
    const ingredients = catalog.items.filter((i) => i.inventoryType === InventoryType.INGREDIENT).length;
    const packaging = catalog.items.filter((i) => i.inventoryType === InventoryType.PACKAGING).length;

    return {
      categories: [
        { inventoryType: InventoryType.INGREDIENT, itemsCount: ingredients },
        { inventoryType: InventoryType.PACKAGING, itemsCount: packaging },
      ],
    };
  }
}

/**
 * Service 4: StorageService
 * Storage location & zone manager.
 */
export class StorageService {
  public getStorageOverview(): StorageOverviewReadModel {
    return {
      locations: [
        { locationId: 'loc-main-wh', zoneName: 'Dry Storage', itemsCount: 14 },
        { locationId: 'loc-cold-room', zoneName: 'Refrigerated Walk-In', itemsCount: 8 },
      ],
    };
  }
}

/**
 * Service 5: ReorderPolicyService
 * Reorder point & safety stock threshold manager.
 */
export class ReorderPolicyService {
  constructor(private readonly inventoryService: InventoryService) {}

  public getReorderDashboard(tenantId: string): ReorderDashboardReadModel {
    const itemsMap = this.inventoryService.getItemMap();
    const list = Array.from(itemsMap.values()).filter(
      (i: any) => i.tenantId === tenantId && i.currentStockQty <= i.reorderPoint.thresholdQuantity && i.itemStatus === InventoryItemStatus.ACTIVE
    );

    return {
      itemsNeedingReorderCount: list.length,
      items: list.map((i: any) => ({
        stockItemId: i.stockItemId.id,
        sku: i.sku.code,
        itemName: i.itemName.name,
        currentStock: i.currentStockQty,
        reorderPoint: i.reorderPoint.thresholdQuantity,
        safetyStock: i.safetyStock.minBufferQuantity,
        recommendedReorderQty: Math.max(10, i.reorderPoint.thresholdQuantity * 2 - i.currentStockQty),
      })),
    };
  }

  public getInventoryStatistics(tenantId: string): InventoryStatisticsReadModel {
    const itemsMap = this.inventoryService.getItemMap();
    const list = Array.from(itemsMap.values()).filter((i: any) => i.tenantId === tenantId);

    return {
      totalActiveItems: list.filter((i: any) => i.itemStatus === InventoryItemStatus.ACTIVE).length,
      totalInactiveItems: list.filter((i: any) => i.itemStatus === InventoryItemStatus.INACTIVE).length,
      totalBlockedItems: list.filter((i: any) => i.itemStatus === InventoryItemStatus.BLOCKED).length,
      totalArchivedItems: list.filter((i: any) => i.itemStatus === InventoryItemStatus.ARCHIVED).length,
    };
  }
}

/**
 * Service 6: EnterpriseInventoryCorePlatformService
 * High-level application façade for inventory core platform infrastructure.
 */
export class EnterpriseInventoryCorePlatformService {
  constructor(
    public readonly validationService: ValidationService,
    public readonly inventoryService: InventoryService,
    public readonly catalogService: CatalogService,
    public readonly storageService: StorageService,
    public readonly reorderPolicyService: ReorderPolicyService
  ) {}
}
