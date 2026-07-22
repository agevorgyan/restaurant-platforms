import { InventoryLedger } from '../aggregates/inventory-ledger.aggregate';
import { Inventory } from '../aggregates/inventory.aggregate';
import { ValuationMethodEnum } from '../value-objects/valuation-method.value-object';
import { InventoryValue } from '../value-objects/inventory-value.value-object';
import { CalculatorFactory } from './inventory-cost.calculator';
import { Money } from '../../../finance/domain/value-objects/money.value-object';

export class InventoryValueCalculator {
  public static calculateTotalValue(
    inventory: Inventory, 
    ledger: InventoryLedger, 
    method: ValuationMethodEnum
  ): InventoryValue {
    const calculator = CalculatorFactory.getCalculator(method);
    const result = calculator.calculate(ledger);
    
    // Total value = unit cost * current onHand quantity
    const totalMinorUnits = result.unitCost.unitCost.amount.value * inventory.onHandQuantity.quantity.value;
    const currency = result.unitCost.unitCost.currency;
    
    return InventoryValue.create(
      Money.create(Math.round(totalMinorUnits), currency),
      inventory.onHandQuantity.quantity
    );
  }
}
