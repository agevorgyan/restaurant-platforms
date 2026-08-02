/**
 * Enterprise Inventory Core Platform - Domain Events
 *
 * Domain events emitted during inventory item creation, updates, non-destructive archiving, and reorder point/location updates.
 */

import { InventoryItemStatus, InventoryType } from '../enums/inventory-core.enums';

export interface InventoryItemCreatedEvent {
  eventName: 'InventoryItemCreated';
  stockItemId: string;
  sku: string;
  itemName: string;
  inventoryType: InventoryType;
  unitOfMeasure: string;
  timestamp: Date;
}

export interface InventoryItemUpdatedEvent {
  eventName: 'InventoryItemUpdated';
  stockItemId: string;
  sku: string;
  itemName: string;
  timestamp: Date;
}

export interface InventoryItemArchivedEvent {
  eventName: 'InventoryItemArchived';
  stockItemId: string;
  sku: string;
  reason: string;
  timestamp: Date;
}

export interface ReorderPointChangedEvent {
  eventName: 'ReorderPointChanged';
  stockItemId: string;
  previousReorderPoint: number;
  newReorderPoint: number;
  timestamp: Date;
}

export interface StorageLocationChangedEvent {
  eventName: 'StorageLocationChanged';
  stockItemId: string;
  previousLocationId: string;
  newLocationId: string;
  timestamp: Date;
}

export type InventoryCoreDomainEvent =
  | InventoryItemCreatedEvent
  | InventoryItemUpdatedEvent
  | InventoryItemArchivedEvent
  | ReorderPointChangedEvent
  | StorageLocationChangedEvent;
