/**
 * Enterprise Inventory Control Platform - Domain Events
 *
 * Domain events emitted during count initiation, count completion, variance detection, waste recording, and adjustment approvals.
 */

import { CountStatus, WasteStatus } from '../enums/inventory-control.enums';

export interface InventoryCountStartedEvent {
  eventName: 'InventoryCountStarted';
  countId: string;
  warehouseId: string;
  countType: 'FULL' | 'CYCLE' | 'SPOT' | 'BLIND' | 'RECOUNT';
  timestamp: Date;
}

export interface InventoryCountCompletedEvent {
  eventName: 'InventoryCountCompleted';
  countId: string;
  totalLinesCounted: number;
  timestamp: Date;
}

export interface VarianceDetectedEvent {
  eventName: 'VarianceDetected';
  countId: string;
  stockItemId: string;
  expectedQty: number;
  actualQty: number;
  varianceQty: number;
  timestamp: Date;
}

export interface WasteRecordedEvent {
  eventName: 'WasteRecorded';
  wasteId: string;
  warehouseId: string;
  stockItemId: string;
  wasteQty: number;
  reasonCategory: string;
  timestamp: Date;
}

export interface AdjustmentRequestedEvent {
  eventName: 'AdjustmentRequested';
  adjustmentRef: string;
  warehouseId: string;
  stockItemId: string;
  adjustmentQty: number;
  reason: string;
  timestamp: Date;
}

export interface AdjustmentApprovedEvent {
  eventName: 'AdjustmentApproved';
  adjustmentRef: string;
  approvedBy: string;
  timestamp: Date;
}

export interface AdjustmentRejectedEvent {
  eventName: 'AdjustmentRejected';
  adjustmentRef: string;
  rejectedBy: string;
  reason: string;
  timestamp: Date;
}

export type InventoryControlDomainEvent =
  | InventoryCountStartedEvent
  | InventoryCountCompletedEvent
  | VarianceDetectedEvent
  | WasteRecordedEvent
  | AdjustmentRequestedEvent
  | AdjustmentApprovedEvent
  | AdjustmentRejectedEvent;
