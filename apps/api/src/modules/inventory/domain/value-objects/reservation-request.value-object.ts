import { ValueObject } from '@saas/core';
import { Quantity } from './quantity.value-object';
import { ReferenceId } from './reference-id.value-object';

export interface ReservationRequestProps {
  inventoryId: string;
  orderId: ReferenceId;
  quantity: Quantity;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

export class ReservationRequest extends ValueObject<ReservationRequestProps> {
  private constructor(props: ReservationRequestProps) {
    super(props);
  }

  public static create(props: ReservationRequestProps): ReservationRequest {
    if (!props.inventoryId) {
      throw new Error('Reservation request must specify an inventory ID');
    }
    if (props.quantity.value <= 0) {
      throw new Error('Reservation request quantity must be strictly positive');
    }
    return new ReservationRequest(props);
  }

  get inventoryId(): string {
    return this.props.inventoryId;
  }

  get orderId(): ReferenceId {
    return this.props.orderId;
  }

  get quantity(): Quantity {
    return this.props.quantity;
  }

  get expiresAt(): Date | undefined {
    return this.props.expiresAt;
  }

  get metadata(): Record<string, any> | undefined {
    return this.props.metadata;
  }
}
