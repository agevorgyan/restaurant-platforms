import { InventoryLedger } from '../aggregates/inventory-ledger.aggregate';
import { InventoryCost } from '../value-objects/inventory-cost.value-object';
import { CostBreakdown, CostLayer } from '../value-objects/cost-breakdown.value-object';
import { ValuationMethodEnum } from '../value-objects/valuation-method.value-object';
import { CostLayerResolver } from './cost-layer.resolver';
import { MovementTypeEnum } from '../value-objects/movement-type.value-object';
import { ValuationPolicy } from '../policies/valuation.policy';
import { Money } from '../../../finance/domain/value-objects/money.value-object';
import { Quantity } from '../value-objects/quantity.value-object';

export interface CostCalculationResult {
  unitCost: InventoryCost;
  breakdown: CostBreakdown;
}

export abstract class InventoryCostCalculator {
  abstract calculate(ledger: InventoryLedger): CostCalculationResult;
}

export class FIFOCostCalculator extends InventoryCostCalculator {
  calculate(ledger: InventoryLedger): CostCalculationResult {
    const layers = CostLayerResolver.resolveFIFOLayers(ledger);
    
    if (layers.length === 0) {
      // Default fallback (needs a currency, we'll try to find any historical currency)
      const historicalReceive = ledger.movements.find(m => m.type.value === MovementTypeEnum.RECEIVE && m.costLayer);
      if (!historicalReceive) {
        throw new Error('Cannot calculate FIFO cost: no historical receive movements with cost found');
      }
      return {
        unitCost: InventoryCost.create(Money.create(0, historicalReceive.costLayer!.currency)),
        breakdown: CostBreakdown.create([])
      };
    }

    // Validate currency matching
    ValuationPolicy.validateCurrencyMatching(layers.map(l => l.unitCost));

    // The unit cost in FIFO can be represented as the cost of the NEXT unit to be consumed (the oldest active layer)
    // Or it could be a blended cost if they want current inventory value.
    // The requirement says "Average Cost" vs "Unit Cost". We'll define unit cost here as the blended average 
    // of all remaining FIFO layers.
    let totalMinorUnits = 0;
    let totalQty = 0;
    const currency = layers[0].unitCost.unitCost.currency;

    for (const layer of layers) {
      totalMinorUnits += layer.unitCost.unitCost.amount.value * layer.quantity.value;
      totalQty += layer.quantity.value;
    }

    const blendedCost = totalQty > 0 ? Math.round(totalMinorUnits / totalQty) : 0;

    return {
      unitCost: InventoryCost.create(Money.create(blendedCost, currency)),
      breakdown: CostBreakdown.create(layers)
    };
  }
}

export class WeightedAverageCostCalculator extends InventoryCostCalculator {
  calculate(ledger: InventoryLedger): CostCalculationResult {
    let totalMinorUnits = 0;
    let totalQty = 0;
    let currency: any = null;

    const receives = ledger.movements.filter(m => m.type.value === MovementTypeEnum.RECEIVE && m.costLayer);
    
    if (receives.length === 0) {
      throw new Error('Cannot calculate Weighted Average cost: no historical receive movements found');
    }

    currency = receives[0].costLayer!.currency;

    for (const receive of receives) {
      if (receive.costLayer!.currency.code !== currency.code) {
        throw new Error('Currency mismatch in historical receives');
      }
      totalMinorUnits += receive.costLayer!.totalCost.amount.value;
      totalQty += receive.quantity.quantity.value;
    }

    const avgCost = totalQty > 0 ? Math.round(totalMinorUnits / totalQty) : 0;
    const precision = receives[0].quantity.quantity.precision;

    const breakdownLayer: CostLayer = {
      quantity: Quantity.create(totalQty, precision),
      unitCost: InventoryCost.create(Money.create(avgCost, currency))
    };

    return {
      unitCost: InventoryCost.create(Money.create(avgCost, currency)),
      breakdown: CostBreakdown.create([breakdownLayer])
    };
  }
}

export class MovingAverageCostCalculator extends InventoryCostCalculator {
  calculate(ledger: InventoryLedger): CostCalculationResult {
    let currentMovingAverage = 0;
    let currentQty = 0;
    let currency: any = null;

    const sortedMovements = [...ledger.movements].sort((a, b) => a.sequence.value - b.sequence.value);

    for (const movement of sortedMovements) {
      const qty = movement.quantity.quantity.value;

      if (movement.type.value === MovementTypeEnum.RECEIVE && movement.costLayer) {
        if (!currency) currency = movement.costLayer.currency;
        
        if (movement.costLayer.currency.code !== currency.code) {
          throw new Error('Currency mismatch in historical receives');
        }

        const totalCostBefore = currentQty * currentMovingAverage;
        const incomingCost = movement.costLayer.totalCost.amount.value;
        
        currentQty += qty;
        currentMovingAverage = (totalCostBefore + incomingCost) / currentQty;
      } else if (
        movement.type.value === MovementTypeEnum.CONSUME ||
        movement.type.value === MovementTypeEnum.WASTE
      ) {
        currentQty = Math.max(0, currentQty - qty); // Cost doesn't change, just quantity
      }
    }

    if (!currency) {
      throw new Error('Cannot calculate Moving Average cost: no historical receive movements found');
    }

    const precision = ledger.movements.length > 0 ? ledger.movements[0].quantity.quantity.precision : null;
    const finalCost = Math.round(currentMovingAverage);

    const breakdownLayer: CostLayer = {
      quantity: Quantity.create(currentQty, precision as any),
      unitCost: InventoryCost.create(Money.create(finalCost, currency))
    };

    return {
      unitCost: InventoryCost.create(Money.create(finalCost, currency)),
      breakdown: CostBreakdown.create([breakdownLayer])
    };
  }
}

export class CalculatorFactory {
  static getCalculator(method: ValuationMethodEnum): InventoryCostCalculator {
    switch (method) {
      case ValuationMethodEnum.FIFO:
        return new FIFOCostCalculator();
      case ValuationMethodEnum.WEIGHTED_AVERAGE:
        return new WeightedAverageCostCalculator();
      case ValuationMethodEnum.MOVING_AVERAGE:
        return new MovingAverageCostCalculator();
      default:
        throw new Error(`Unsupported valuation method: ${method}`);
    }
  }
}
