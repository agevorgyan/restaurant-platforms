import { StockMovement } from '../entities/stock-movement.entity';
import { MovementConsistencySpecification } from '../specifications/movement-consistency.specification';
import { MovementReferenceSpecification } from '../specifications/movement-reference.specification';

export class MovementCreationPolicy {
  public static validateCreation(movement: StockMovement): void {
    MovementConsistencySpecification.isSatisfiedBy(movement);
    MovementReferenceSpecification.isSatisfiedBy(movement);
  }
}
