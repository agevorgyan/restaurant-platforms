import { StockMovement } from '../entities/stock-movement.entity';

export class MovementConsistencySpecification {
  public static isSatisfiedBy(movement: StockMovement): boolean {
    if (movement.quantity.quantity.value <= 0) {
      throw new Error('Movement quantity must be greater than zero');
    }

    if (!movement.type || !movement.status) {
      throw new Error('Movement must have a valid type and status');
    }

    if (!movement.actor) {
      throw new Error('Movement must have an actor');
    }

    if (!movement.reason) {
      throw new Error('Movement must have a reason');
    }

    return true;
  }
}
