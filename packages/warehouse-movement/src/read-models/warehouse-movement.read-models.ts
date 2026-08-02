/**
 * Enterprise Warehouse & Stock Movement Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Warehouse Overview, Stock Balances, Reservation Dashboard,
 * Transfer History, Movement Ledger, and Availability Matrix.
 */

import { MovementStatus, MovementType } from '../domain/enums/warehouse-movement.enums';

export interface WarehouseSummaryReadModel {
  warehouseId: string;
  name: string;
  type: string;
  totalStockItemsCount: number;
}

export interface WarehouseOverviewReadModel {
  totalWarehousesCount: number;
  warehouses: WarehouseSummaryReadModel[];
}

export interface StockBalanceItemReadModel {
  warehouseId: string;
  stockItemId: string;
  physicalStock: number;
  reservedStock: number;
  availableStock: number;
}

export interface StockBalancesReadModel {
  warehouseId: string;
  balances: StockBalanceItemReadModel[];
}

export interface ReservationItemReadModel {
  reservationId: string;
  warehouseId: string;
  stockItemId: string;
  reservedQuantity: number;
  reservedAt: string;
}

export interface ReservationDashboardReadModel {
  activeReservationsCount: number;
  reservations: ReservationItemReadModel[];
}

export interface TransferHistoryItemReadModel {
  transferRef: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  stockItemId: string;
  quantity: number;
  transferredAt: string;
}

export interface TransferHistoryReadModel {
  totalTransfersCount: number;
  transfers: TransferHistoryItemReadModel[];
}

export interface MovementLedgerEntryReadModel {
  movementId: string;
  warehouseId: string;
  stockItemId: string;
  type: MovementType;
  quantityDelta: number;
  status: MovementStatus;
  timestamp: string;
}

export interface MovementLedgerReadModel {
  totalEntriesCount: number;
  entries: MovementLedgerEntryReadModel[];
}

export interface AvailabilityMatrixReadModel {
  warehouseId: string;
  stockItemId: string;
  isAvailable: boolean;
  physicalStock: number;
  reservedStock: number;
  netAvailableStock: number;
}
