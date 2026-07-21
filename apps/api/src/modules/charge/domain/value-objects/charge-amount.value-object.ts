import { ValueObject } from '@saas/core';
import { Money } from '../../../finance/domain/value-objects/money.value-object';
import { Percentage } from '../../../finance/domain/value-objects/percentage.value-object';

export interface ChargeAmountProps {
  amount?: Money;
  percentage?: Percentage;
}

export class ChargeAmount extends ValueObject<ChargeAmountProps> {
  private constructor(props: ChargeAmountProps) {
    super(props);
  }

  public static fromMoney(amount: Money): ChargeAmount {
    return new ChargeAmount({ amount });
  }

  public static fromPercentage(percentageValue: number): ChargeAmount {
    if (percentageValue < 0) {
      throw new Error('Percentage charge cannot be negative unless explicitly allowed by another domain construct');
    }
    return new ChargeAmount({
      percentage: Percentage.create(percentageValue, true)
    });
  }

  get isFixed(): boolean {
    return this.props.amount !== undefined;
  }

  get amount(): Money | undefined {
    return this.props.amount;
  }

  get percentage(): Percentage | undefined {
    return this.props.percentage;
  }
}
