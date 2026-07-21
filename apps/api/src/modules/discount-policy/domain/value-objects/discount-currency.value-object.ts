import { ValueObject } from '@saas/core';

export interface DiscountCurrencyProps {
  code: string; // e.g. USD, EUR
}

export class DiscountCurrency extends ValueObject<DiscountCurrencyProps> {
  private constructor(props: DiscountCurrencyProps) {
    super(props);
  }

  public static create(code: string): DiscountCurrency {
    if (!code || code.trim().length !== 3) {
      throw new Error('Currency code must be a valid 3-letter ISO code');
    }
    return new DiscountCurrency({ code: code.toUpperCase() });
  }

  get code(): string {
    return this.props.code;
  }
}
