import { ValueObject } from '@saas/core';
import { Money } from '../../../finance/domain/value-objects/money.value-object';

export interface InventoryCostProps {
  unitCost: Money;
}

/**
 * Represents the cost of a single unit of inventory.
 * Enforces business rules like non-negative costs.
 */
export class InventoryCost extends ValueObject<InventoryCostProps> {
  private constructor(props: InventoryCostProps) {
    super(props);
  }

  public static create(unitCost: Money): InventoryCost {
    if (unitCost.amount.value < 0) {
      throw new Error('Inventory cost cannot be negative');
    }

    return new InventoryCost({ unitCost });
  }

  get unitCost(): Money {
    return this.props.unitCost;
  }

  public isZero(): boolean {
    return this.props.unitCost.amount.value === 0;
  }
}
