import { ValueObject } from '@saas/core';

export interface OrderTimestampProps {
  value: Date;
}

export class OrderTimestamp extends ValueObject<OrderTimestampProps> {
  private constructor(props: OrderTimestampProps) {
    super(props);
  }

  public static create(value: Date): OrderTimestamp {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error('OrderTimestamp must be a valid Date object');
    }
    return new OrderTimestamp({ value });
  }

  public static now(): OrderTimestamp {
    return new OrderTimestamp({ value: new Date() });
  }

  get value(): Date {
    return this.props.value;
  }
}
