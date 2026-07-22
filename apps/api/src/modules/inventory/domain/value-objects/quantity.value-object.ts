import { ValueObject } from '@saas/core';
import { UnitPrecision } from './unit-precision.value-object';

export interface QuantityProps {
  value: number;
  precision: UnitPrecision;
}

export class Quantity extends ValueObject<QuantityProps> {
  private constructor(props: QuantityProps) {
    super(props);
  }

  public static create(value: number, precision: UnitPrecision): Quantity {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error('Quantity must be a valid number');
    }
    if (value < 0) {
      throw new Error('Quantity cannot be negative');
    }

    // Normalize value based on precision to avoid floating point issues
    const normalizedValue = Number(Math.round(Number(value + 'e' + precision.value)) + 'e-' + precision.value);

    return new Quantity({ value: normalizedValue, precision });
  }

  public add(other: Quantity): Quantity {
    this.assertSamePrecision(other);
    return Quantity.create(this.value + other.value, this.precision);
  }

  public subtract(other: Quantity): Quantity {
    this.assertSamePrecision(other);
    return Quantity.create(this.value - other.value, this.precision);
  }

  public multiply(multiplier: number): Quantity {
    if (multiplier < 0) {
      throw new Error('Multiplier cannot be negative');
    }
    return Quantity.create(this.value * multiplier, this.precision);
  }

  public divide(divisor: number): Quantity {
    if (divisor <= 0) {
      throw new Error('Divisor must be greater than zero');
    }
    return Quantity.create(this.value / divisor, this.precision);
  }

  public isGreaterThan(other: Quantity): boolean {
    this.assertSamePrecision(other);
    return this.value > other.value;
  }

  public isLessThan(other: Quantity): boolean {
    this.assertSamePrecision(other);
    return this.value < other.value;
  }

  public isGreaterThanOrEqual(other: Quantity): boolean {
    this.assertSamePrecision(other);
    return this.value >= other.value;
  }

  public isLessThanOrEqual(other: Quantity): boolean {
    this.assertSamePrecision(other);
    return this.value <= other.value;
  }

  public isZero(): boolean {
    return this.value === 0;
  }

  private assertSamePrecision(other: Quantity): void {
    if (this.precision.value !== other.precision.value) {
      throw new Error('Cannot perform arithmetic operations on quantities with different precisions');
    }
  }

  get value(): number {
    return this.props.value;
  }

  get precision(): UnitPrecision {
    return this.props.precision;
  }
}
