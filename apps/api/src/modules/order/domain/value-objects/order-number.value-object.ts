import { ValueObject } from '@saas/core';

export interface OrderNumberProps {
  value: string;
}

export class OrderNumber extends ValueObject<OrderNumberProps> {
  private constructor(props: OrderNumberProps) {
    super(props);
  }

  public static create(value: string): OrderNumber {
    if (!value || value.trim().length === 0) {
      throw new Error('OrderNumber cannot be empty');
    }

    if (value.length > 50) {
      throw new Error('OrderNumber cannot exceed 50 characters');
    }

    return new OrderNumber({ value: value.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
