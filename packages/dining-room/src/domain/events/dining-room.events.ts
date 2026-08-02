/**
 * Enterprise Dining Room & Floor Management Platform - Domain Events
 *
 * Domain events emitted during floor creation, area management, table position updates, table merges/splits, and status changes.
 */

import { TableStatus } from '../enums/dining-room.enums';

export interface FloorCreatedEvent {
  eventName: 'FloorCreated';
  floorId: string;
  name: string;
  timestamp: Date;
}

export interface AreaCreatedEvent {
  eventName: 'AreaCreated';
  areaId: string;
  floorId: string;
  name: string;
  timestamp: Date;
}

export interface TableAddedEvent {
  eventName: 'TableAdded';
  tableId: string;
  tableNumber: string;
  areaId: string;
  capacity: number;
  timestamp: Date;
}

export interface TableMovedEvent {
  eventName: 'TableMoved';
  tableId: string;
  newX: number;
  newY: number;
  rotation: number;
  timestamp: Date;
}

export interface TableMergedEvent {
  eventName: 'TableMerged';
  primaryTableId: string;
  secondaryTableId: string;
  timestamp: Date;
}

export interface TableSplitEvent {
  eventName: 'TableSplit';
  primaryTableId: string;
  secondaryTableId: string;
  timestamp: Date;
}

export interface TableStatusChangedEvent {
  eventName: 'TableStatusChanged';
  tableId: string;
  previousStatus: TableStatus;
  newStatus: TableStatus;
  timestamp: Date;
}

export interface AreaClosedEvent {
  eventName: 'AreaClosed';
  areaId: string;
  reason: string;
  timestamp: Date;
}

export type DiningRoomDomainEvent =
  | FloorCreatedEvent
  | AreaCreatedEvent
  | TableAddedEvent
  | TableMovedEvent
  | TableMergedEvent
  | TableSplitEvent
  | TableStatusChangedEvent
  | AreaClosedEvent;
