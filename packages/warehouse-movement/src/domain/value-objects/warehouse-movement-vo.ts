/**
 * Enterprise Warehouse & Stock Movement Platform - Value Objects
 *
 * Immutable Value Objects encapsulating warehouse IDs, locations, movement IDs, movement references,
 * quantities, availability, reservations, transfer references, and ledger transactions.
 */

import { MovementStatus, MovementType } from '../enums/warehouse-movement.enums';

/**
 * Identifiers: WarehouseId, StockMovementId, MovementReference, TransferReference
 */
export class WarehouseId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): WarehouseId {
    return new WarehouseId(id || `wh-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

export class StockMovementId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): StockMovementId {
    return new StockMovementId(id || `mvt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

export class MovementReference {
  public readonly ref: string;

  private constructor(ref: string) {
    this.ref = ref;
  }

  public static create(ref?: string): MovementReference {
    return new MovementReference(ref || `REF-${Date.now()}`);
  }
}

export class TransferReference {
  public readonly transferRef: string;

  private constructor(transferRef: string) {
    this.transferRef = transferRef;
  }

  public static create(transferRef?: string): TransferReference {
    return new TransferReference(transferRef || `TRF-${Math.floor(10000 + Math.random() * 90000)}`);
  }
}

/**
 * Quantities & Availability: MovementQuantity, AvailableQuantity, ReservedQuantity
 */
export class MovementQuantity {
  public readonly amount: number;

  private constructor(amount: number) {
    this.amount = amount;
  }

  public static create(amount: number): MovementQuantity {
    return new MovementQuantity(amount);
  }
}

export class AvailableQuantity {
  public readonly amount: number;

  private constructor(amount: number) {
    this.amount = Math.max(0, amount);
  }

  public static create(amount: number): AvailableQuantity {
    return new AvailableQuantity(amount);
  }
}

export class ReservedQuantity {
  public readonly amount: number;

  private constructor(amount: number) {
    this.amount = Math.max(0, amount);
  }

  public static create(amount: number): ReservedQuantity {
    return new ReservedQuantity(amount);
  }
}

/**
 * Reservations & Transactions: WarehouseLocation, StockReservation, InventoryTransaction
 */
export class WarehouseLocation {
  public readonly name: string;
  public readonly type: 'CENTRAL' | 'RESTAURANT' | 'KITCHEN' | 'BAR' | 'COLD_STORAGE' | 'FREEZER' | 'TRANSIT';

  private constructor(name: string, type: 'CENTRAL' | 'RESTAURANT' | 'KITCHEN' | 'BAR' | 'COLD_STORAGE' | 'FREEZER' | 'TRANSIT') {
    this.name = name;
    this.type = type;
  }

  public static create(
    name: string = 'Main Central Warehouse',
    type: 'CENTRAL' | 'RESTAURANT' | 'KITCHEN' | 'BAR' | 'COLD_STORAGE' | 'FREEZER' | 'TRANSIT' = 'CENTRAL'
  ): WarehouseLocation {
    return new WarehouseLocation(name, type);
  }
}

export class StockReservation {
  public readonly reservationId: string;
  public readonly warehouseId: string;
  public readonly stockItemId: string;
  public readonly reservedQty: ReservedQuantity;
  public readonly reservedAt: Date;

  private constructor(reservationId: string, warehouseId: string, stockItemId: string, reservedQty: ReservedQuantity) {
    this.reservationId = reservationId;
    this.warehouseId = warehouseId;
    this.stockItemId = stockItemId;
    this.reservedQty = reservedQty;
    this.reservedAt = new Date();
  }

  public static create(warehouseId: string, stockItemId: string, qty: number): StockReservation {
    const reservationId = `resv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    return new StockReservation(reservationId, warehouseId, stockItemId, ReservedQuantity.create(qty));
  }
}

export class InventoryTransaction {
  public readonly movementId: StockMovementId;
  public readonly type: MovementType;
  public readonly quantity: MovementQuantity;
  public readonly status: MovementStatus;
  public readonly timestamp: Date;

  private constructor(movementId: StockMovementId, type: MovementType, quantity: MovementQuantity, status: MovementStatus) {
    this.movementId = movementId;
    this.type = type;
    this.quantity = quantity;
    this.status = status;
    this.timestamp = new Date();
  }

  public static create(type: MovementType, quantity: number, status: MovementStatus = MovementStatus.COMPLETED): InventoryTransaction {
    return new InventoryTransaction(StockMovementId.create(), type, MovementQuantity.create(quantity), status);
  }
}
