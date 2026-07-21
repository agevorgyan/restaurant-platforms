import { ValueObject } from '@saas/core';

export enum OrderTypeEnum {
  DELIVERY = 'Delivery',
  PICKUP = 'Pickup',
  DINE_IN = 'Dine-In',
  DRIVE_THRU = 'Drive-Thru',
  CATERING = 'Catering',
  SCHEDULED = 'Scheduled'
}

export interface OrderTypeProps {
  value: OrderTypeEnum;
}

export class OrderType extends ValueObject<OrderTypeProps> {
  private constructor(props: OrderTypeProps) {
    super(props);
  }

  public static create(value: OrderTypeEnum): OrderType {
    if (!Object.values(OrderTypeEnum).includes(value)) {
      throw new Error(`Unsupported order type: ${value}`);
    }
    return new OrderType({ value });
  }

  get value(): OrderTypeEnum {
    return this.props.value;
  }
}
