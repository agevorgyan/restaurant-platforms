import { ValueObject } from '@saas/core';

export interface OrderCorrelationIdProps {
  value: string;
}

export class OrderCorrelationId extends ValueObject<OrderCorrelationIdProps> {
  private constructor(props: OrderCorrelationIdProps) {
    super(props);
  }

  public static create(value?: string): OrderCorrelationId {
    const id = value || crypto.randomUUID();
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('OrderCorrelationId must be a valid UUID');
    }

    return new OrderCorrelationId({ value: id });
  }

  get value(): string {
    return this.props.value;
  }
}
