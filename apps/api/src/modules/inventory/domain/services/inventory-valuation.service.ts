import { Inventory } from '../aggregates/inventory.aggregate';
import { InventoryLedger } from '../aggregates/inventory-ledger.aggregate';
import { ValuationMethod, ValuationMethodEnum } from '../value-objects/valuation-method.value-object';
import { CostSnapshot } from '../value-objects/cost-snapshot.value-object';
import { CalculatorFactory } from './inventory-cost.calculator';
import { InventoryValueCalculator } from './inventory-value.calculator';
import { InventoryValuationSpecification } from '../specifications/inventory-valuation.specification';
import { CostCalculationPolicy } from '../policies/cost-calculation.policy';
import { DomainEvent } from '@saas/core';
import { InventoryValuationCalculatedEvent, InventoryCostCalculatedEvent, CostSnapshotCreatedEvent } from '../events/inventory-valuation.events';

export class InventoryValuationService {
  /**
   * Orchestrates the complete valuation and costing process.
   * Emits relevant domain events and returns a snapshot.
   */
  public static calculateValuation(
    inventory: Inventory,
    ledger: InventoryLedger,
    method: ValuationMethodEnum
  ): { snapshot: CostSnapshot, events: DomainEvent[] } {
    const methodVO = ValuationMethod.create(method);
    InventoryValuationSpecification.isSatisfiedBy(methodVO);

    const calculator = CalculatorFactory.getCalculator(method);
    const costResult = calculator.calculate(ledger);

    CostCalculationPolicy.validate(costResult.unitCost);

    const totalValue = InventoryValueCalculator.calculateTotalValue(inventory, ledger, method);

    const snapshot = CostSnapshot.create({
      inventoryId: inventory.id,
      method: methodVO,
      totalValue,
      unitCost: costResult.unitCost,
      breakdown: costResult.breakdown
    });

    const events: DomainEvent[] = [
      new InventoryValuationCalculatedEvent(inventory.id, totalValue, method),
      new InventoryCostCalculatedEvent(inventory.id, costResult.unitCost, method),
      new CostSnapshotCreatedEvent(inventory.id, snapshot)
    ];

    return { snapshot, events };
  }
}
