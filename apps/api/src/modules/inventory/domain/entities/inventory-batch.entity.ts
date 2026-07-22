import { Entity } from '@saas/core';
import { BatchNumber } from '../value-objects/batch-number.value-object';
import { Quantity } from '../value-objects/quantity.value-object';
import { ManufacturingDate } from '../value-objects/manufacturing-date.value-object';
import { ExpirationDate } from '../value-objects/expiration-date.value-object';
import { ReferenceId } from '../value-objects/reference-id.value-object';

export interface InventoryBatchProps {
  id: string;
  inventoryId: string;
  batchNumber: BatchNumber;
  quantity: Quantity;
  manufacturingDate?: ManufacturingDate;
  expirationDate?: ExpirationDate;
  supplierReference?: ReferenceId;
  isActive: boolean;
  createdAt: Date;
}

export class InventoryBatch extends Entity<InventoryBatchProps> {
  get id(): string {
    return this._id;
  }

  get inventoryId(): string {
    return this.props.inventoryId;
  }

  get batchNumber(): BatchNumber {
    return this.props.batchNumber;
  }

  get quantity(): Quantity {
    return this.props.quantity;
  }

  get manufacturingDate(): ManufacturingDate | undefined {
    return this.props.manufacturingDate;
  }

  get expirationDate(): ExpirationDate | undefined {
    return this.props.expirationDate;
  }

  get supplierReference(): ReferenceId | undefined {
    return this.props.supplierReference;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  public deactivate(): void {
    this.props.isActive = false;
  }

  public addQuantity(amount: Quantity): void {
    this.props.quantity = this.props.quantity.add(amount);
  }

  public subtractQuantity(amount: Quantity): void {
    if (this.props.quantity.isLessThan(amount)) {
      throw new Error(`Cannot subtract ${amount.value} from batch ${this.batchNumber.value} (Only ${this.props.quantity.value} available)`);
    }
    this.props.quantity = this.props.quantity.subtract(amount);
  }

  public static create(props: Omit<InventoryBatchProps, 'isActive' | 'createdAt'>): InventoryBatch {
    if (props.quantity.value < 0) {
      throw new Error('Batch quantity cannot be negative');
    }
    
    if (props.manufacturingDate && props.expirationDate) {
      if (props.manufacturingDate.value > props.expirationDate.value) {
        throw new Error('Manufacturing date cannot be after expiration date');
      }
    }

    return new InventoryBatch(props.id, {
      ...props,
      isActive: true,
      createdAt: new Date()
    });
  }
}
