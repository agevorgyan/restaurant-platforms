import { ValueObject } from '@saas/core';

export enum OrderPriorityEnum {
  LOW = 'Low',
  NORMAL = 'Normal',
  HIGH = 'High',
  URGENT = 'Urgent'
}

export interface OrderPriorityProps {
  value: OrderPriorityEnum;
}

export class OrderPriority extends ValueObject<OrderPriorityProps> {
  private constructor(props: OrderPriorityProps) {
    super(props);
  }

  public static create(value: OrderPriorityEnum): OrderPriority {
    if (!Object.values(OrderPriorityEnum).includes(value)) {
      throw new Error(`Unsupported order priority: ${value}`);
    }
    return new OrderPriority({ value });
  }

  get value(): OrderPriorityEnum {
    return this.props.value;
  }
}
