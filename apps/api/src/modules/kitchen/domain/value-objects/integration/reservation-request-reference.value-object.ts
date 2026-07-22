import { ValueObject } from '@saas/core';
import { Quantity } from '../../../../inventory/domain/value-objects/quantity.value-object';
import { InventoryRequestReference } from './inventory-request-reference.value-object';

export interface ReservationItem {
  ingredientId: string;
  quantity: Quantity;
}

export interface ReservationRequestReferenceProps {
  reference: InventoryRequestReference;
  orderId?: string;
  productionId?: string;
  items: ReservationItem[];
  requestedAt: Date;
}

export class ReservationRequestReference extends ValueObject<ReservationRequestReferenceProps> {
  get reference(): InventoryRequestReference {
    return this.props.reference;
  }

  get orderId(): string | undefined {
    return this.props.orderId;
  }

  get productionId(): string | undefined {
    return this.props.productionId;
  }

  get items(): ReservationItem[] {
    return [...this.props.items];
  }

  get requestedAt(): Date {
    return this.props.requestedAt;
  }

  private constructor(props: ReservationRequestReferenceProps) {
    super(props);
  }

  public static create(
    reference: InventoryRequestReference,
    items: ReservationItem[],
    orderId?: string,
    productionId?: string
  ): ReservationRequestReference {
    if (!orderId && !productionId) {
      throw new Error('Reservation must be linked to either an order or a production block');
    }
    if (!items || items.length === 0) {
      throw new Error('Reservation request must contain items');
    }
    return new ReservationRequestReference({
      reference,
      orderId,
      productionId,
      items: [...items],
      requestedAt: new Date()
    });
  }
}
