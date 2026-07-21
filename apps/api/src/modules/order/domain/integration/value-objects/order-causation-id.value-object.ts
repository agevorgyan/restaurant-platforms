import { ValueObject } from '@saas/core';

export interface OrderCausationIdProps {
  value: string;
}

export class OrderCausationId extends ValueObject<OrderCausationIdProps> {
  private constructor(props: OrderCausationIdProps) {
    super(props);
  }

  public static create(value: string): OrderCausationId {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new Error('OrderCausationId must be a valid UUID');
    }

    return new OrderCausationId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
