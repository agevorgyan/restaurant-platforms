/**
 * Enterprise Warehouse & Stock Movement Platform - Domain Services
 *
 * Implements core domain services for warehouse management:
 * 1. MovementValidationService (Stock Ledger & Movement Validator)
 * 2. WarehouseService (Warehouse & Location Hierarchy Manager)
 * 3. StockLedgerService (Append-Only Immutable Stock Transaction Ledger Coordinator)
 * 4. ReservationService (Physical Non-Reducing Soft Stock Reservation Manager)
 * 5. TransferService (Double-Entry Inter-Warehouse Transfer Coordinator: OUT from source, IN to destination)
 * 6. AvailabilityService (Dynamic Ledger-Derived Availability Matrix Engine)
 * 7. EnterpriseWarehousePlatformService (Primary Application Façade)
 */

import { MovementStatus, MovementType } from '../domain/enums/warehouse-movement.enums';

import {
  AvailableQuantity,
  MovementQuantity,
  MovementReference,
  ReservedQuantity,
  StockMovementId,
  StockReservation,
  TransferReference,
  WarehouseId,
  WarehouseLocation,
} from '../domain/value-objects/warehouse-movement-vo';
import {
  AvailabilityMatrixReadModel,
  MovementLedgerEntryReadModel,
  MovementLedgerReadModel,
  ReservationDashboardReadModel,
  StockBalancesReadModel,
  TransferHistoryReadModel,
  WarehouseOverviewReadModel,
} from '../read-models/warehouse-movement.read-models';

/**
 * Service 1: MovementValidationService
 * Movement quantity & ledger consistency validator.
 */
export class MovementValidationService {
  public validateQuantityPositive(qty: number): void {
    if (qty <= 0) throw new Error(`Warehouse movement error: Quantity must be greater than 0, received ${qty}`);
  }

  public validateTransferWarehouses(fromWh: string, toWh: string): void {
    if (fromWh === toWh) {
      throw new Error(`Warehouse transfer error: Source warehouse ${fromWh} cannot be identical to destination warehouse`);
    }
  }
}

/**
 * Service 2: WarehouseService
 * Warehouse registration & location hierarchy manager.
 */
export class WarehouseService {
  private readonly warehousesMap = new Map<string, { id: WarehouseId; location: WarehouseLocation }>();

  constructor() {
    // Seed default central & kitchen warehouses
    this.registerWarehouse('wh-central', 'Main Central Warehouse', 'CENTRAL');
    this.registerWarehouse('wh-kitchen', 'Kitchen Cold Storage', 'COLD_STORAGE');
  }

  public registerWarehouse(
    idStr?: string,
    name: string = 'New Warehouse',
    type: 'CENTRAL' | 'RESTAURANT' | 'KITCHEN' | 'BAR' | 'COLD_STORAGE' | 'FREEZER' | 'TRANSIT' = 'RESTAURANT'
  ): WarehouseId {
    const id = WarehouseId.create(idStr);
    const location = WarehouseLocation.create(name, type);
    this.warehousesMap.set(id.id, { id, location });
    return id;
  }

  public getWarehouseOverview(): WarehouseOverviewReadModel {
    const list = Array.from(this.warehousesMap.values());
    return {
      totalWarehousesCount: list.length,
      warehouses: list.map((w) => ({
        warehouseId: w.id.id,
        name: w.location.name,
        type: w.location.type,
        totalStockItemsCount: 12,
      })),
    };
  }
}

/**
 * Service 3: StockLedgerService
 * Append-only immutable stock transaction ledger coordinator. Stock quantities are NEVER updated in-place.
 */
export class StockLedgerService {
  private readonly ledgerEntries: MovementLedgerEntryReadModel[] = [];

  constructor(private readonly validator: MovementValidationService) {}

  public recordMovement(
    warehouseId: string,
    stockItemId: string,
    type: MovementType,
    quantityDelta: number,
    status: MovementStatus = MovementStatus.COMPLETED
  ): string {
    const movementId = StockMovementId.create().id;
    const entry: MovementLedgerEntryReadModel = {
      movementId,
      warehouseId,
      stockItemId,
      type,
      quantityDelta,
      status,
      timestamp: new Date().toISOString(),
    };
    this.ledgerEntries.push(entry);
    return movementId;
  }

  public calculatePhysicalStock(warehouseId: string, stockItemId: string): number {
    return this.ledgerEntries
      .filter((e) => e.warehouseId === warehouseId && e.stockItemId === stockItemId && e.status === MovementStatus.COMPLETED)
      .reduce((acc, curr) => acc + curr.quantityDelta, 0);
  }

  public getMovementLedger(warehouseId?: string): MovementLedgerReadModel {
    const list = warehouseId ? this.ledgerEntries.filter((e) => e.warehouseId === warehouseId) : this.ledgerEntries;
    return {
      totalEntriesCount: list.length,
      entries: list,
    };
  }
}

/**
 * Service 4: ReservationService
 * Physical non-reducing soft stock reservation manager. Does NOT reduce physical stock.
 */
export class ReservationService {
  private readonly reservationsMap = new Map<string, StockReservation>();

  constructor(private readonly ledgerService: StockLedgerService) {}

  public reserveStock(warehouseId: string, stockItemId: string, qty: number): StockReservation {
    const physical = this.ledgerService.calculatePhysicalStock(warehouseId, stockItemId);
    const reserved = this.getActiveReservedQuantity(warehouseId, stockItemId);
    const netAvailable = physical - reserved;

    if (netAvailable < qty) {
      throw new Error(`Stock reservation error: Insufficient net available stock (${netAvailable}) for requested reservation ${qty}`);
    }

    const resv = StockReservation.create(warehouseId, stockItemId, qty);
    this.reservationsMap.set(resv.reservationId, resv);
    return resv;
  }

  public releaseReservation(reservationId: string): void {
    if (!this.reservationsMap.has(reservationId)) {
      throw new Error(`Reservation error: Reservation ${reservationId} not found`);
    }
    this.reservationsMap.delete(reservationId);
  }

  public getActiveReservedQuantity(warehouseId: string, stockItemId: string): number {
    let total = 0;
    for (const resv of this.reservationsMap.values()) {
      if (resv.warehouseId === warehouseId && resv.stockItemId === stockItemId) {
        total += resv.reservedQty.amount;
      }
    }
    return total;
  }

  public getReservationDashboard(): ReservationDashboardReadModel {
    const list = Array.from(this.reservationsMap.values());
    return {
      activeReservationsCount: list.length,
      reservations: list.map((r) => ({
        reservationId: r.reservationId,
        warehouseId: r.warehouseId,
        stockItemId: r.stockItemId,
        reservedQuantity: r.reservedQty.amount,
        reservedAt: r.reservedAt.toISOString(),
      })),
    };
  }
}

/**
 * Service 5: TransferService
 * Double-entry inter-warehouse transfer coordinator (OUT from source, IN to destination).
 */
export class TransferService {
  private readonly transfers: Array<{
    transferRef: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    stockItemId: string;
    quantity: number;
    transferredAt: string;
  }> = [];

  constructor(
    private readonly validator: MovementValidationService,
    private readonly ledgerService: StockLedgerService
  ) {}

  public executeTransfer(fromWarehouseId: string, toWarehouseId: string, stockItemId: string, qty: number): string {
    this.validator.validateTransferWarehouses(fromWarehouseId, toWarehouseId);
    this.validator.validateQuantityPositive(qty);

    const physical = this.ledgerService.calculatePhysicalStock(fromWarehouseId, stockItemId);
    if (physical < qty) {
      throw new Error(`Transfer error: Insufficient physical stock in ${fromWarehouseId} (${physical}) for transfer quantity ${qty}`);
    }

    const transferRef = TransferReference.create().transferRef;

    // Double-entry ledger logic: OUT from source, IN to destination
    this.ledgerService.recordMovement(fromWarehouseId, stockItemId, MovementType.TRANSFER, -qty);
    this.ledgerService.recordMovement(toWarehouseId, stockItemId, MovementType.TRANSFER, qty);

    this.transfers.push({
      transferRef,
      fromWarehouseId,
      toWarehouseId,
      stockItemId,
      quantity: qty,
      transferredAt: new Date().toISOString(),
    });

    return transferRef;
  }

  public getTransferHistory(): TransferHistoryReadModel {
    return {
      totalTransfersCount: this.transfers.length,
      transfers: this.transfers,
    };
  }
}

/**
 * Service 6: AvailabilityService
 * Dynamic ledger-derived availability matrix engine.
 */
export class AvailabilityService {
  constructor(
    private readonly ledgerService: StockLedgerService,
    private readonly reservationService: ReservationService
  ) {}

  public getAvailabilityMatrix(warehouseId: string, stockItemId: string): AvailabilityMatrixReadModel {
    const physical = this.ledgerService.calculatePhysicalStock(warehouseId, stockItemId);
    const reserved = this.reservationService.getActiveReservedQuantity(warehouseId, stockItemId);
    const netAvailable = physical - reserved;

    return {
      warehouseId,
      stockItemId,
      isAvailable: netAvailable > 0,
      physicalStock: physical,
      reservedStock: reserved,
      netAvailableStock: netAvailable,
    };
  }

  public getStockBalances(warehouseId: string, stockItemIds: string[]): StockBalancesReadModel {
    return {
      warehouseId,
      balances: stockItemIds.map((itemId) => {
        const physical = this.ledgerService.calculatePhysicalStock(warehouseId, itemId);
        const reserved = this.reservationService.getActiveReservedQuantity(warehouseId, itemId);
        return {
          warehouseId,
          stockItemId: itemId,
          physicalStock: physical,
          reservedStock: reserved,
          availableStock: Math.max(0, physical - reserved),
        };
      }),
    };
  }
}

/**
 * Service 7: EnterpriseWarehousePlatformService
 * High-level application façade for warehouse & stock movement platform infrastructure.
 */
export class EnterpriseWarehousePlatformService {
  constructor(
    public readonly validator: MovementValidationService,
    public readonly warehouseService: WarehouseService,
    public readonly ledgerService: StockLedgerService,
    public readonly reservationService: ReservationService,
    public readonly transferService: TransferService,
    public readonly availabilityService: AvailabilityService
  ) {}
}
