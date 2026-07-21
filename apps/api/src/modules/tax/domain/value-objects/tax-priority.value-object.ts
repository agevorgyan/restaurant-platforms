import { ValueObject } from '@saas/core';

export interface TaxPriorityProps {
  value: number;
}

export class TaxPriority extends ValueObject<TaxPriorityProps> {
  private constructor(props: TaxPriorityProps) {
    super(props);
  }

  public static create(value: number): TaxPriority {
    if (!Number.isInteger(value)) {
      throw new Error('Priority must be an integer');
    }
    if (value < 0) {
      throw new Error('Priority cannot be negative');
    }
    return new TaxPriority({ value });
  }

  get value(): number {
    return this.props.value;
  }

  public isHigherThan(other: TaxPriority): boolean {
    return this.props.value > other.props.value;
  }
}
