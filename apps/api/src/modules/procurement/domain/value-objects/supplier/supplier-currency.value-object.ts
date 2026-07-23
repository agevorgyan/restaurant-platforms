import { ValueObject } from '@saas/core';

export interface SupplierCurrencyProps {
  code: string;
}

export class SupplierCurrency extends ValueObject<SupplierCurrencyProps> {
  get code(): string {
    return this.props.code;
  }

  private constructor(props: SupplierCurrencyProps) {
    super(props);
  }

  public static create(code: string): SupplierCurrency {
    if (!code || code.trim().length !== 3) {
      throw new Error('Currency code must be exactly 3 characters');
    }
    return new SupplierCurrency({ code: code.trim().toUpperCase() });
  }
}
