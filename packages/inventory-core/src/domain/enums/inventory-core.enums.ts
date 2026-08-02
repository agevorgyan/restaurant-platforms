/**
 * Enterprise Inventory Core Platform - Domain Enums
 *
 * Defines core domain enumerations for inventory item status and inventory categories/types.
 */

export enum InventoryItemStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
  ARCHIVED = 'ARCHIVED',
}

export enum InventoryType {
  INGREDIENT = 'INGREDIENT',
  PACKAGING = 'PACKAGING',
  FINISHED_PRODUCT = 'FINISHED_PRODUCT',
  SUPPLY = 'SUPPLY',
  BEVERAGE = 'BEVERAGE',
}
