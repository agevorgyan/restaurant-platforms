import { ValueObject } from '@saas/core';
import { ValuationMethod } from './valuation-method.value-object';
import { InventoryValue } from './inventory-value.value-object';
import { InventoryCost } from './inventory-cost.value-object';
import { CostBreakdown } from './cost-breakdown.value-object';

export interface CostSnapshotProps {
  inventoryId: string;
  method: ValuationMethod;
  totalValue: InventoryValue;
  unitCost: InventoryCost;
  breakdown: CostBreakdown;
  calculatedAt: Date;
}

/**
 * An immutable snapshot representing the full valuation of an inventory
 * aggregate at a specific point in time.
 */
export class CostSnapshot extends ValueObject<CostSnapshotProps> {
  private constructor(props: CostSnapshotProps) {
    super(props);
  }

  public static create(props: Omit<CostSnapshotProps, 'calculatedAt'>): CostSnapshot {
    if (!props.inventoryId) {
      throw new Error('Cost snapshot requires an inventory ID');
    }

    return new CostSnapshot({
      ...props,
      calculatedAt: new Date()
    });
  }

  get inventoryId(): string {
    return this.props.inventoryId;
  }

  get method(): ValuationMethod {
    return this.props.method;
  }

  get totalValue(): InventoryValue {
    return this.props.totalValue;
  }

  get unitCost(): InventoryCost {
    return this.props.unitCost;
  }

  get breakdown(): CostBreakdown {
    return this.props.breakdown;
  }

  get calculatedAt(): Date {
    return this.props.calculatedAt;
  }
}
