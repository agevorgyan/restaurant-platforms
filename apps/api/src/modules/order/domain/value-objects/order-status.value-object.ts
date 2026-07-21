import { ValueObject } from '@saas/core';

export enum OrderStatusEnum {
  DRAFT = 'Draft',
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  PREPARING = 'Preparing',
  READY = 'Ready',
  OUT_FOR_DELIVERY = 'OutForDelivery',
  DELIVERED = 'Delivered',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  REJECTED = 'Rejected'
}

export interface OrderStatusProps {
  value: OrderStatusEnum;
}

export class OrderStatus extends ValueObject<OrderStatusProps> {
  private constructor(props: OrderStatusProps) {
    super(props);
  }

  public static create(value: OrderStatusEnum): OrderStatus {
    if (!Object.values(OrderStatusEnum).includes(value)) {
      throw new Error(`Unsupported order status: ${value}`);
    }
    return new OrderStatus({ value });
  }

  get value(): OrderStatusEnum {
    return this.props.value;
  }

  public canBeEdited(): boolean {
    return this.props.value !== OrderStatusEnum.CANCELLED;
  }

  public canChangeType(): boolean {
    return this.props.value !== OrderStatusEnum.CONFIRMED && this.props.value !== OrderStatusEnum.CANCELLED;
  }
}
