import { ValueObject } from '@saas/core';
import { Money } from '../../../finance/domain/value-objects/money.value-object';

export interface MovementCostProps {
  unitCost: Money;
  totalCost: Money;
}

export class MovementCost extends ValueObject<MovementCostProps> {
  private constructor(props: MovementCostProps) {
    super(props);
  }

  public static create(unitCost: Money, totalCost: Money): MovementCost {
    if (unitCost.currency !== totalCost.currency) {
      throw new Error('Unit cost and total cost must use the same currency');
    }
    return new MovementCost({ unitCost, totalCost });
  }

  get unitCost(): Money {
    return this.props.unitCost;
  }

  get totalCost(): Money {
    return this.props.totalCost;
  }
}
