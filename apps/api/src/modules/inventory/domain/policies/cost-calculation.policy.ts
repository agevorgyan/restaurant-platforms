import { InventoryCost } from '../value-objects/inventory-cost.value-object';

export class CostCalculationPolicy {
  public static validate(cost: InventoryCost): void {
    if (!cost) {
      throw new Error('Cost object is required for validation');
    }

    if (cost.unitCost.amount.value < 0) {
      throw new Error('Calculated cost cannot be negative');
    }

    if (!cost.unitCost.currency || !cost.unitCost.currency.code) {
      throw new Error('Currency is required for calculated cost');
    }
  }
}
