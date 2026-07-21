import { ValueObject } from '@saas/core';

export interface MonetaryPrecisionProps {
  value: number;
}

export class MonetaryPrecision extends ValueObject<MonetaryPrecisionProps> {
  private constructor(props: MonetaryPrecisionProps) {
    super(props);
  }

  public static create(value: number): MonetaryPrecision {
    if (!Number.isInteger(value)) {
      throw new Error('Monetary precision must be an integer');
    }
    if (value < 0) {
      throw new Error('Monetary precision cannot be negative');
    }
    return new MonetaryPrecision({ value });
  }

  get value(): number {
    return this.props.value;
  }
}
