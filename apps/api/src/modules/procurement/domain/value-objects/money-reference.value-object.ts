import { ValueObject } from '@saas/core';

export interface MoneyReferenceProps {
  amount: number;
  currency: string;
}

export class MoneyReference extends ValueObject<MoneyReferenceProps> {
  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }

  private constructor(props: MoneyReferenceProps) {
    super(props);
  }

  public static create(amount: number, currency: string = 'USD'): MoneyReference {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
    if (!currency || currency.trim() === '') {
      throw new Error('Currency cannot be empty');
    }
    return new MoneyReference({ amount, currency: currency.trim() });
  }
}
