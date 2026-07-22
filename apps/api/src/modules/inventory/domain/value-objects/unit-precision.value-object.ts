import { ValueObject } from '@saas/core';

export interface UnitPrecisionProps {
  value: number;
}

export class UnitPrecision extends ValueObject<UnitPrecisionProps> {
  private constructor(props: UnitPrecisionProps) {
    super(props);
  }

  public static create(value: number): UnitPrecision {
    if (!Number.isInteger(value) || value < 0 || value > 6) {
      throw new Error('Unit precision must be an integer between 0 and 6');
    }
    return new UnitPrecision({ value });
  }

  get value(): number {
    return this.props.value;
  }
}
