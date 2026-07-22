import { StockMovement } from '../entities/stock-movement.entity';
import { CostLayerSpecification } from '../specifications/cost-layer.specification';

export class CostLayerPolicy {
  public static validateCostLayer(movement: StockMovement): void {
    CostLayerSpecification.isSatisfiedBy(movement);
  }
}
