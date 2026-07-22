import { InventoryCost } from '../value-objects/inventory-cost.value-object';

export class ValuationPolicy {
  public static validateCurrencyMatching(costs: InventoryCost[]): void {
    if (!costs || costs.length === 0) {
      return;
    }

    const firstCurrency = costs[0].unitCost.currency.code;
    for (const cost of costs) {
      if (cost.unitCost.currency.code !== firstCurrency) {
        throw new Error('Currency mismatch in cost layers. Cannot calculate valuation with mixed currencies.');
      }
    }
  }

}
