import { ValueObject } from '@saas/core';

export interface OrderQuotationIdProps {
  value: string;
}

export class OrderQuotationId extends ValueObject<OrderQuotationIdProps> {
  private constructor(props: OrderQuotationIdProps) {
    super(props);
  }

  public static create(value: string): OrderQuotationId {
    if (!value || value.trim().length === 0) {
      throw new Error('OrderQuotationId cannot be empty');
    }
    return new OrderQuotationId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
