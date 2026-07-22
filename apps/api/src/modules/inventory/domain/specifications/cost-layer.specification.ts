import { StockMovement } from '../entities/stock-movement.entity';
import { MovementTypeEnum } from '../value-objects/movement-type.value-object';

export class CostLayerSpecification {
  public static isSatisfiedBy(movement: StockMovement): boolean {
    // Receiving stock should typically have a cost layer
    if (movement.type.value === MovementTypeEnum.RECEIVE) {
      if (!movement.costLayer) {
        throw new Error('Receive movements must include a cost layer');
      }

      if (movement.costLayer.unitCost.amount.value <= 0 || movement.costLayer.totalCost.amount.value <= 0) {
        throw new Error('Cost layer amounts must be strictly positive for receiving');
      }
    }

    // Transfers and internal adjustments might not necessarily change cost, 
    // but if a cost layer is provided, its totalCost should match unitCost * quantity
    if (movement.costLayer) {
      const expectedTotal = movement.costLayer.unitCost.amount.value * movement.quantity.quantity.value;
      // Allow for slight floating point variations (precision to 4 decimals)
      const difference = Math.abs(movement.costLayer.totalCost.amount.value - expectedTotal);
      if (difference > 0.01) {
        throw new Error('Total cost must approximately equal unit cost multiplied by quantity');
      }
    }

    return true;
  }
}
