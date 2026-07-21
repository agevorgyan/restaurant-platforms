import { ValueObject } from '@saas/core';

export interface MonetaryAmountProps {
  value: number; // Stored in minor units (e.g. cents) to avoid floating point issues
}

export class MonetaryAmount extends ValueObject<MonetaryAmountProps> {
  private constructor(props: MonetaryAmountProps) {
    super(props);
  }

  public static create(value: number): MonetaryAmount {
    if (!Number.isFinite(value) || Number.isNaN(value)) {
      throw new Error('Monetary amount must be a finite number');
    }
    // Must be an integer since it represents minor units
    if (!Number.isInteger(value)) {
      throw new Error('Monetary amount must be an integer representing minor units');
    }

    // Safety bounds (JavaScript MAX_SAFE_INTEGER is 9,007,199,254,740,991)
    if (value > Number.MAX_SAFE_INTEGER || value < Number.MIN_SAFE_INTEGER) {
      throw new Error('Monetary amount exceeds safe integer limits');
    }

    return new MonetaryAmount({ value });
  }

  get value(): number {
    return this.props.value;
  }
}
