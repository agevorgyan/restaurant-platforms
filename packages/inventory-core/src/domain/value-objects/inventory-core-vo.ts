/**
 * Enterprise Inventory Core Platform - Value Objects
 *
 * Immutable Value Objects encapsulating stock item IDs, tenant-unique SKUs, barcodes, item names,
 * categories, units of measure, reorder points, safety stock, storage locations, shelf life, and stock statuses.
 */

import { InventoryItemStatus, InventoryType } from '../enums/inventory-core.enums';

/**
 * Identifiers: StockItemId, Sku, Barcode
 */
export class StockItemId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): StockItemId {
    return new StockItemId(id || `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

export class Sku {
  public readonly code: string;

  private constructor(code: string) {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed || trimmed.length < 3) {
      throw new Error('SKU validation error: SKU code must be at least 3 alphanumeric characters');
    }
    this.code = trimmed;
  }

  public static create(code: string): Sku {
    return new Sku(code);
  }
}

export class Barcode {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value.trim();
  }

  public static create(value?: string): Barcode {
    return new Barcode(value || `EAN-${Math.floor(100000000000 + Math.random() * 900000000000)}`);
  }
}

/**
 * Item Attributes: ItemName, InventoryCategory, UnitOfMeasure, ShelfLife, StockStatus
 */
export class ItemName {
  public readonly name: string;

  private constructor(name: string) {
    if (!name.trim()) throw new Error('Item name cannot be empty');
    this.name = name.trim();
  }

  public static create(name: string): ItemName {
    return new ItemName(name);
  }
}

export class InventoryCategory {
  public readonly type: InventoryType;
  public readonly categoryName: string;

  private constructor(type: InventoryType, categoryName: string) {
    this.type = type;
    this.categoryName = categoryName;
  }

  public static create(type: InventoryType = InventoryType.INGREDIENT, categoryName: string = 'General'): InventoryCategory {
    return new InventoryCategory(type, categoryName);
  }
}

export class UnitOfMeasure {
  public readonly unit: 'PIECE' | 'KILOGRAM' | 'GRAM' | 'LITER' | 'MILLILITER' | 'BOTTLE' | 'BOX' | 'PACK' | 'CUSTOM';
  public readonly customName?: string;

  private constructor(unit: 'PIECE' | 'KILOGRAM' | 'GRAM' | 'LITER' | 'MILLILITER' | 'BOTTLE' | 'BOX' | 'PACK' | 'CUSTOM', customName?: string) {
    this.unit = unit;
    this.customName = customName;
  }

  public static create(
    unit: 'PIECE' | 'KILOGRAM' | 'GRAM' | 'LITER' | 'MILLILITER' | 'BOTTLE' | 'BOX' | 'PACK' | 'CUSTOM' = 'KILOGRAM',
    customName?: string
  ): UnitOfMeasure {
    return new UnitOfMeasure(unit, customName);
  }
}

export class ShelfLife {
  public readonly days: number;

  private constructor(days: number) {
    this.days = Math.max(0, days);
  }

  public static create(days: number = 30): ShelfLife {
    return new ShelfLife(days);
  }
}

export class StockStatus {
  public readonly state: 'AVAILABLE' | 'RESERVED' | 'ON_ORDER' | 'BLOCKED' | 'EXPIRED' | 'DISCONTINUED';

  private constructor(state: 'AVAILABLE' | 'RESERVED' | 'ON_ORDER' | 'BLOCKED' | 'EXPIRED' | 'DISCONTINUED') {
    this.state = state;
  }

  public static create(state: 'AVAILABLE' | 'RESERVED' | 'ON_ORDER' | 'BLOCKED' | 'EXPIRED' | 'DISCONTINUED' = 'AVAILABLE'): StockStatus {
    return new StockStatus(state);
  }
}

/**
 * Reorder & Storage: ReorderPoint, SafetyStock, StorageLocation
 */
export class ReorderPoint {
  public readonly thresholdQuantity: number;

  private constructor(thresholdQuantity: number) {
    this.thresholdQuantity = Math.max(0, thresholdQuantity);
  }

  public static create(thresholdQuantity: number = 10): ReorderPoint {
    return new ReorderPoint(thresholdQuantity);
  }
}

export class SafetyStock {
  public readonly minBufferQuantity: number;

  private constructor(minBufferQuantity: number) {
    this.minBufferQuantity = Math.max(0, minBufferQuantity);
  }

  public static create(minBufferQuantity: number = 5): SafetyStock {
    return new SafetyStock(minBufferQuantity);
  }
}

export class StorageLocation {
  public readonly locationId: string;
  public readonly zoneName: string;
  public readonly shelfCode: string;

  private constructor(locationId: string, zoneName: string, shelfCode: string) {
    this.locationId = locationId;
    this.zoneName = zoneName;
    this.shelfCode = shelfCode;
  }

  public static create(locationId: string = 'loc-main-wh', zoneName: string = 'Dry Storage', shelfCode: string = 'A-01'): StorageLocation {
    return new StorageLocation(locationId, zoneName, shelfCode);
  }
}
