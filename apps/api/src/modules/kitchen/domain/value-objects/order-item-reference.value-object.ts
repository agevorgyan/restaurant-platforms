import { ValueObject } from '@saas/core';

export interface OrderItemReferenceProps {
  orderId: string;
  orderItemId: string;
}

export class OrderItemReference extends ValueObject<OrderItemReferenceProps> {
  get orderId(): string {
    return this.props.orderId;
  }

  get orderItemId(): string {
    return this.props.orderItemId;
  }

  private constructor(props: OrderItemReferenceProps) {
    super(props);
  }

  public static create(orderId: string, orderItemId: string): OrderItemReference {
    if (!orderId || orderId.trim() === '') {
      throw new Error('Order ID cannot be empty');
    }
    if (!orderItemId || orderItemId.trim() === '') {
      throw new Error('Order Item ID cannot be empty');
    }
    return new OrderItemReference({
      orderId: orderId.trim(),
      orderItemId: orderItemId.trim()
    });
  }
}
