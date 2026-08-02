/**
 * Enterprise Inventory Core Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, InventoryItem Aggregate Root, Tenant-Scoped Unique SKU Validation,
 * Configurable Units of Measure, Non-Destructive Archiving, Reorder Policies, and CQRS Read Models.
 */

import { InventoryItemStatus, InventoryType } from '../src/domain/enums/inventory-core.enums';
import {
  Barcode,
  ReorderPoint,
  SafetyStock,
  Sku,
  UnitOfMeasure,
} from '../src/domain/value-objects/inventory-core-vo';
import {
  CatalogService,
  EnterpriseInventoryCorePlatformService,
  InventoryService,
  ReorderPolicyService,
  StorageService,
  ValidationService,
} from '../src/services/inventory-core.services';

describe('Enterprise Inventory Core Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should format Sku code and UnitOfMeasure correctly', () => {
      const sku = Sku.create('  ing-flour-01 ');
      expect(sku.code).toBe('ING-FLOUR-01');

      expect(() => Sku.create('a')).toThrow('SKU validation error');

      const uom = UnitOfMeasure.create('KILOGRAM');
      expect(uom.unit).toBe('KILOGRAM');
    });

    it('should format ReorderPoint and SafetyStock correctly', () => {
      const rp = ReorderPoint.create(20);
      expect(rp.thresholdQuantity).toBe(20);

      const ss = SafetyStock.create(10);
      expect(ss.minBufferQuantity).toBe(10);
    });
  });

  describe('ValidationService & Tenant-Scoped SKU Uniqueness', () => {
    let validationService: ValidationService;

    beforeEach(() => {
      validationService = new ValidationService();
    });

    it('should enforce SKU uniqueness per tenant and permit identical SKUs across different tenants', () => {
      validationService.registerSku('tenant-a', 'SKU-100');

      expect(() => {
        validationService.registerSku('tenant-a', 'SKU-100');
      }).toThrow('SKU \'SKU-100\' already exists for tenant tenant-a');

      // Tenant B can use the same SKU code
      expect(() => {
        validationService.registerSku('tenant-b', 'SKU-100');
      }).not.toThrow();
    });
  });

  describe('InventoryService & Non-Destructive Archiving', () => {
    let validationService: ValidationService;
    let inventoryService: InventoryService;

    beforeEach(() => {
      validationService = new ValidationService();
      inventoryService = new InventoryService(validationService);
    });

    it('should create inventory item and archive instead of deleting', () => {
      const itemId = inventoryService.createInventoryItem('tenant-1', 'SKU-MILK-01', 'Whole Milk 1L', InventoryType.INGREDIENT, 'LITER', 15, 5, 40);
      expect(itemId.id).toBeDefined();

      inventoryService.archiveInventoryItem('tenant-1', itemId.id, 'Discontinued product line');

      const itemMap = inventoryService.getItemMap();
      const item = itemMap.get(itemId.id);
      expect(item.itemStatus).toBe(InventoryItemStatus.ARCHIVED);
    });
  });

  describe('ReorderPolicyService & CatalogService', () => {
    let validationService: ValidationService;
    let inventoryService: InventoryService;
    let catalogService: CatalogService;
    let reorderPolicyService: ReorderPolicyService;

    beforeEach(() => {
      validationService = new ValidationService();
      inventoryService = new InventoryService(validationService);
      catalogService = new CatalogService(inventoryService);
      reorderPolicyService = new ReorderPolicyService(inventoryService);
    });

    it('should project InventoryCatalog and identify items needing reorder', () => {
      // Stock = 5, ReorderPoint = 15 -> Low stock item
      inventoryService.createInventoryItem('tenant-1', 'SKU-BUTTER', 'Unsalted Butter 500g', InventoryType.INGREDIENT, 'GRAM', 15, 5, 5);

      const catalog = catalogService.getInventoryCatalog('tenant-1');
      expect(catalog.totalItemsCount).toBe(1);

      const reorderDash = reorderPolicyService.getReorderDashboard('tenant-1');
      expect(reorderDash.itemsNeedingReorderCount).toBe(1);
      expect(reorderDash.items[0].recommendedReorderQty).toBeGreaterThan(0);
    });
  });

  describe('EnterpriseInventoryCorePlatformService Façade Integration', () => {
    let validationService: ValidationService;
    let inventoryService: InventoryService;
    let catalogService: CatalogService;
    let storageService: StorageService;
    let reorderPolicyService: ReorderPolicyService;
    let platformService: EnterpriseInventoryCorePlatformService;

    beforeEach(() => {
      validationService = new ValidationService();
      inventoryService = new InventoryService(validationService);
      catalogService = new CatalogService(inventoryService);
      storageService = new StorageService();
      reorderPolicyService = new ReorderPolicyService(inventoryService);

      platformService = new EnterpriseInventoryCorePlatformService(
        validationService,
        inventoryService,
        catalogService,
        storageService,
        reorderPolicyService
      );
    });

    it('should query StorageOverview via platform facade', () => {
      const storage = platformService.storageService.getStorageOverview();
      expect(storage.locations.length).toBeGreaterThan(0);
    });
  });
});
