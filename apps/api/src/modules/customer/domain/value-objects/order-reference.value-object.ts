import { ValueObject } from '@saas/core';

export interface OrderReferenceProps { orderId: string; }

export class OrderReference extends ValueObject<OrderReferenceProps> {
  get orderId(): string { return this.props.orderId; }
  private constructor(props: OrderReferenceProps) { super(props); }
  public static create(orderId: string): OrderReference {
    return new OrderReference({ orderId });
  }
}