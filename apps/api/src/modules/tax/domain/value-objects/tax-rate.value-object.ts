import { ValueObject } from '@saas/core';
import { Percentage } from '../../../finance/domain/value-objects/percentage.value-object';

export interface TaxRateProps {
  value: Percentage;
}

export class TaxRate extends ValueObject<TaxRateProps> {
  private constructor(props: TaxRateProps) {
    super(props);
  }

  public static create(percentageValue: number): TaxRate {
    if (percentageValue < 0) {
      throw new Error('Tax percentages cannot be negative');
    }
    return new TaxRate({
      value: Percentage.create(percentageValue, true) // Allow over 100% theoretically
    });
  }

  get value(): Percentage {
    return this.props.value;
  }
}
