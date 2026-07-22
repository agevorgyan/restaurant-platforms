import { AggregateRoot } from '@saas/core';
import { InventoryBatch } from '../entities/inventory-batch.entity';
import { InventoryReservation } from '../entities/inventory-reservation.entity';
import { InventoryThreshold } from '../entities/inventory-threshold.entity';
import { InventoryLocationEntity } from '../entities/inventory-location.entity';
import { OnHandQuantity } from '../value-objects/on-hand-quantity.value-object';
import { ReservedQuantity } from '../value-objects/reserved-quantity.value-object';
import { AvailableQuantity } from '../value-objects/available-quantity.value-object';
import { InventoryState, InventoryStateEnum } from '../value-objects/inventory-state.value-object';
import { InventoryVersion } from '../value-objects/inventory-version.value-object';
import { Quantity } from '../value-objects/quantity.value-object';
import { UnitPrecision } from '../value-objects/unit-precision.value-object';
import { InventoryCreatedEvent, InventoryAdjustedEvent } from '../events/inventory.events';
import { ThresholdPolicy } from '../policies/threshold.policy';
import { InventoryValidationPolicy } from '../policies/inventory-validation.policy';

export interface InventoryProps {
  id: string;
  restaurantId: string;
  ingredientId: string;
  location: InventoryLocationEntity;
  state: InventoryState;
  onHandQuantity: OnHandQuantity;
  reservedQuantity: ReservedQuantity;
  availableQuantity: AvailableQuantity;
  batches: InventoryBatch[];
  reservations: InventoryReservation[];
  threshold?: InventoryThreshold;
  version: InventoryVersion;
  precision: UnitPrecision;
  createdAt: Date;
  updatedAt: Date;
}

export class Inventory extends AggregateRoot<InventoryProps> {
  get id(): string {
    return this._id;
  }

  get restaurantId(): string {
    return this.props.restaurantId;
  }

  get ingredientId(): string {
    return this.props.ingredientId;
  }

  get location(): InventoryLocationEntity {
    return this.props.location;
  }

  get state(): InventoryState {
    return this.props.state;
  }

  get onHandQuantity(): OnHandQuantity {
    return this.props.onHandQuantity;
  }

  get reservedQuantity(): ReservedQuantity {
    return this.props.reservedQuantity;
  }

  get availableQuantity(): AvailableQuantity {
    return this.props.availableQuantity;
  }

  get batches(): InventoryBatch[] {
    return [...this.props.batches];
  }

  get reservations(): InventoryReservation[] {
    return [...this.props.reservations];
  }

  get threshold(): InventoryThreshold | undefined {
    return this.props.threshold;
  }

  get version(): InventoryVersion {
    return this.props.version;
  }

  get precision(): UnitPrecision {
    return this.props.precision;
  }

  private constructor(id: string, props: InventoryProps) {
    super(id, props);
  }

  public static create(
    id: string,
    restaurantId: string,
    ingredientId: string,
    location: InventoryLocationEntity,
    precision: UnitPrecision,
    threshold?: InventoryThreshold
  ): Inventory {
    const onHandQuantity = OnHandQuantity.initial(precision);
    const reservedQuantity = ReservedQuantity.initial(precision);
    const availableQuantity = AvailableQuantity.calculate(onHandQuantity.quantity, reservedQuantity.quantity);

    const inventory = new Inventory(id, {
      id,
      restaurantId,
      ingredientId,
      location,
      state: InventoryState.create(InventoryStateEnum.ACTIVE),
      onHandQuantity,
      reservedQuantity,
      availableQuantity,
      batches: [],
      reservations: [],
      threshold,
      version: InventoryVersion.create(1),
      precision,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    InventoryValidationPolicy.validate(inventory);

    inventory.addDomainEvent(
      new InventoryCreatedEvent(id, restaurantId, ingredientId, location.id)
    );

    return inventory;
  }

  public addBatch(batch: InventoryBatch): void {
    if (this.state.value !== InventoryStateEnum.ACTIVE) {
      throw new Error('Cannot add batch to inactive inventory');
    }

    const isDuplicate = this.props.batches.some(
      b => b.isActive && b.batchNumber.value === batch.batchNumber.value && b.id !== batch.id
    );
    if (isDuplicate) {
      throw new Error(`Duplicate active batch number: ${batch.batchNumber.value}`);
    }

    this.props.batches.push(batch);
    
    // Add batch quantity to on-hand quantity
    this.adjustQuantity(batch.quantity, true);
  }

  public deactivateBatch(batchId: string): void {
    const batch = this.props.batches.find(b => b.id === batchId);
    if (!batch) {
      throw new Error(`Batch not found: ${batchId}`);
    }

    if (!batch.isActive) {
      return;
    }

    // Subtract remaining batch quantity from on-hand
    if (!batch.quantity.isZero()) {
      this.adjustQuantity(batch.quantity, false);
    }
    
    batch.deactivate();
    this.incrementVersion();
  }

  public addReservation(reservation: InventoryReservation): void {
    if (this.state.value !== InventoryStateEnum.ACTIVE) {
      throw new Error('Cannot reserve stock from inactive inventory');
    }

    const isDuplicate = this.props.reservations.some(
      r => !r.isReleased && r.orderReference.value === reservation.orderReference.value && r.id !== reservation.id
    );
    if (isDuplicate) {
      throw new Error(`Duplicate active reservation for order: ${reservation.orderReference.value}`);
    }

    if (reservation.quantity.isGreaterThan(this.availableQuantity.quantity)) {
      throw new Error(`Reservation quantity ${reservation.quantity.value} exceeds available quantity ${this.availableQuantity.quantity.value}`);
    }

    this.props.reservations.push(reservation);
    
    // Increase reserved quantity
    this.props.reservedQuantity = this.props.reservedQuantity.add(reservation.quantity);
    
    // Recalculate available
    this.recalculateAvailable();
    this.incrementVersion();
    
    const events = ThresholdPolicy.checkThresholds(this);
    events.forEach(e => this.addDomainEvent(e));
  }

  public releaseReservation(reservationId: string): void {
    const reservation = this.props.reservations.find(r => r.id === reservationId);
    if (!reservation) {
      throw new Error(`Reservation not found: ${reservationId}`);
    }

    if (reservation.isReleased) {
      return;
    }

    reservation.release();
    
    // Decrease reserved quantity
    this.props.reservedQuantity = this.props.reservedQuantity.subtract(reservation.quantity);
    
    // Recalculate available
    this.recalculateAvailable();
    this.incrementVersion();
  }

  public adjustQuantity(amount: Quantity, isAddition: boolean): void {
    if (this.state.value !== InventoryStateEnum.ACTIVE) {
      throw new Error('Cannot adjust quantity for inactive inventory');
    }

    if (isAddition) {
      this.props.onHandQuantity = this.props.onHandQuantity.add(amount);
    } else {
      if (amount.isGreaterThan(this.props.onHandQuantity.quantity)) {
        throw new Error('Cannot subtract more than on-hand quantity');
      }
      this.props.onHandQuantity = this.props.onHandQuantity.subtract(amount);
    }

    this.recalculateAvailable();
    this.incrementVersion();

    this.addDomainEvent(
      new InventoryAdjustedEvent(
        this.id, 
        this.restaurantId, 
        this.onHandQuantity.quantity.value, 
        this.availableQuantity.quantity.value
      )
    );

    const events = ThresholdPolicy.checkThresholds(this);
    events.forEach(e => this.addDomainEvent(e));
  }

  private recalculateAvailable(): void {
    this.props.availableQuantity = AvailableQuantity.calculate(
      this.props.onHandQuantity.quantity,
      this.props.reservedQuantity.quantity
    );
  }

  private incrementVersion(): void {
    this.props.version = InventoryVersion.create(this.props.version.value + 1);
    this.props.updatedAt = new Date();
  }
}
