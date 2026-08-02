/**
 * Enterprise Inventory Valuation & Costing Platform - Domain Events
 *
 * Domain events emitted during cost layer creation, valuation calculation, average cost updates, landed cost allocations, and value changes.
 */

import { CostStatus, ValuationMethod } from '../enums/inventory-costing.enums';

export interface CostLayerCreatedEvent {
  eventName: 'CostLayerCreated';
  costLayerId: string;
  stockItemId: string;
  quantity: number;
  unitCost: number;
  totalLayerValue: number;
  timestamp: Date;
}

export interface InventoryValuationCalculatedEvent {
  eventName: 'InventoryValuationCalculated';
  method: ValuationMethod;
  totalAssetValue: number;
  timestamp: Date;
}

export interface AverageCostUpdatedEvent {
  eventName: 'AverageCostUpdated';
  stockItemId: string;
  previousAverageCost: number;
  newAverageCost: number;
  timestamp: Date;
}

export interface LandedCostAllocatedEvent {
  eventName: 'LandedCostAllocated';
  costLayerId: string;
  allocatedLandedAmount: number;
  newUnitCost: number;
  timestamp: Date;
}

export interface CostAdjustedEvent {
  eventName: 'CostAdjusted';
  stockItemId: string;
  adjustmentAmount: number;
  reason: string;
  timestamp: Date;
}

export interface InventoryValueChangedEvent {
  eventName: 'InventoryValueChanged';
  stockItemId: string;
  previousValue: number;
  newValue: number;
  timestamp: Date;
}

export type InventoryCostingDomainEvent =
  | CostLayerCreatedEvent
  | InventoryValuationCalculatedEvent
  | AverageCostUpdatedEvent
  | LandedCostAllocatedEvent
  | CostAdjustedEvent
  | InventoryValueChangedEvent;
