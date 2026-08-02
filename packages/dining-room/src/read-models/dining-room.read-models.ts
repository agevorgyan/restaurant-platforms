/**
 * Enterprise Dining Room & Floor Management Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Floor Overview, Area Overview, Table Map,
 * Capacity Report, Layout Snapshots, and Table Statistics.
 */

import { AreaStatus, TableStatus } from '../domain/enums/dining-room.enums';

export interface FloorOverviewReadModel {
  floorId: string;
  name: string;
  totalAreas: number;
  totalTables: number;
  activeOccupancyCount: number;
}

export interface AreaOverviewReadModel {
  areaId: string;
  floorId: string;
  name: string;
  status: AreaStatus;
  tablesCount: number;
  openCapacity: number;
}

export interface TableItemReadModel {
  tableId: string;
  tableNumber: string;
  areaId: string;
  capacityMin: number;
  capacityMax: number;
  shape: string;
  x: number;
  y: number;
  rotation: number;
  status: TableStatus;
  mergedWithPrimaryTableId?: string;
}

export interface TableMapReadModel {
  floorId: string;
  areaId: string;
  tables: TableItemReadModel[];
}

export interface CapacityReportReadModel {
  floorId: string;
  totalCapacitySeats: number;
  occupiedSeats: number;
  availableSeats: number;
  occupancyRatePercentage: number;
}

export interface LayoutSnapshotReadModel {
  snapshotId: string;
  floorId: string;
  version: number;
  tablesCount: number;
  capturedAt: string;
}

export interface TableStatisticsReadModel {
  totalAvailable: number;
  totalOccupied: number;
  totalReserved: number;
  totalCleaning: number;
  totalBlocked: number;
  totalOutOfService: number;
}
