import { ValueObject } from '@saas/core';

export interface OrderCurrencyProps { code: string; }

export class OrderCurrency extends ValueObject<OrderCurrencyProps> {
  get code(): string { return this.props.code; }
  private constructor(props: OrderCurrencyProps) { super(props); }
  public static create(code: string): OrderCurrency {
    if (!code || code.length !== 3) throw new Error('Invalid currency code');
    return new OrderCurrency({ code: code.toUpperCase() });
  }
}