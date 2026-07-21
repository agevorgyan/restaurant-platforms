import { ValueObject } from '@saas/core';

export enum PriorityLevel {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface OrderEventPriorityProps {
  value: PriorityLevel;
}

export class OrderEventPriority extends ValueObject<OrderEventPriorityProps> {
  private constructor(props: OrderEventPriorityProps) {
    super(props);
  }

  public static create(value: PriorityLevel = PriorityLevel.NORMAL): OrderEventPriority {
    if (!Object.values(PriorityLevel).includes(value)) {
      throw new Error(`Invalid OrderEventPriority: ${value}`);
    }
    return new OrderEventPriority({ value });
  }

  get value(): PriorityLevel {
    return this.props.value;
  }
}
