import { ValueObject } from '@saas/core';

export interface OrderIdProps {
  value: string;
}

export class OrderId extends ValueObject<OrderIdProps> {
  private constructor(props: OrderIdProps) {
    super(props);
  }

  public static create(value: string): OrderId {
    if (!value || value.trim().length === 0) {
      throw new Error('OrderId cannot be empty');
    }
    
    // Validate UUID format roughly
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new Error('OrderId must be a valid UUID');
    }

    return new OrderId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
