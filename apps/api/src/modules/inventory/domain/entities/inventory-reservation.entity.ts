import { Entity } from '@saas/core';
import { Quantity } from '../value-objects/quantity.value-object';
import { ReferenceId } from '../value-objects/reference-id.value-object';

export interface InventoryReservationProps {
  id: string;
  inventoryId: string;
  orderReference: ReferenceId;
  quantity: Quantity;
  reservationTimestamp: Date;
  expirationTimestamp: Date;
  isReleased: boolean;
}

export class InventoryReservation extends Entity<InventoryReservationProps> {
  get id(): string {
    return this._id;
  }

  get inventoryId(): string {
    return this.props.inventoryId;
  }

  get orderReference(): ReferenceId {
    return this.props.orderReference;
  }

  get quantity(): Quantity {
    return this.props.quantity;
  }

  get expirationTimestamp(): Date {
    return this.props.expirationTimestamp;
  }

  get isReleased(): boolean {
    return this.props.isReleased;
  }

  public isExpired(currentTime: Date = new Date()): boolean {
    return !this.props.isReleased && currentTime > this.props.expirationTimestamp;
  }

  public release(): void {
    if (this.props.isReleased) {
      throw new Error('Reservation is already released');
    }
    this.props.isReleased = true;
  }

  public static create(props: Omit<InventoryReservationProps, 'reservationTimestamp' | 'isReleased'>): InventoryReservation {
    if (props.quantity.value <= 0) {
      throw new Error('Reservation quantity must be greater than zero');
    }

    const reservationTimestamp = new Date();
    if (props.expirationTimestamp <= reservationTimestamp) {
      throw new Error('Expiration timestamp must be in the future');
    }

    return new InventoryReservation(props.id, {
      ...props,
      reservationTimestamp,
      isReleased: false
    });
  }
}
