/**
 * Enterprise Warehouse & Stock Movement Platform - Domain Events
 *
 * Domain events emitted during stock receipts, reservations, releases, transfers, adjustments, and ledger reversals.
 */

import { MovementStatus, MovementType } from '../enums/warehouse-movement.enums';

export interface StockReceivedEvent {
  eventName: 'StockReceived';
  movementId: string;
  warehouseId: string;
  stockItemId: string;
  quantity: number;
  timestamp: Date;
}

export interface StockReservedEvent {
  eventName: 'StockReserved';
  reservationId: string;
  warehouseId: string;
  stockItemId: string;
  reservedQuantity: number;
  timestamp: Date;
}

export interface ReservationReleasedEvent {
  eventName: 'ReservationReleased';
  reservationId: string;
  timestamp: Date;
}

export interface StockTransferredEvent {
  eventName: 'StockTransferred';
  transferRef: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  stockItemId: string;
  quantity: number;
  timestamp: Date;
}

export interface StockAdjustedEvent {
  eventName: 'StockAdjusted';
  movementId: string;
  warehouseId: string;
  stockItemId: string;
  adjustmentDelta: number;
  reason: string;
  timestamp: Date;
}

export interface MovementReversedEvent {
  eventName: 'MovementReversed';
  originalMovementId: string;
  reversalMovementId: string;
  timestamp: Date;
}

export interface InventoryBalancedEvent {
  eventName: 'InventoryBalanced';
  warehouseId: string;
  stockItemId: string;
  physicalStock: number;
  availableStock: number;
  timestamp: Date;
}

export type WarehouseMovementDomainEvent =
  | StockReceivedEvent
  | StockReservedEvent
  | ReservationReleasedEvent
  | StockTransferredEvent
  | StockAdjustedEvent
  | MovementReversedEvent
  | InventoryBalancedEvent;
