import { StockMovement } from '../entities/stock-movement.entity';
import { LedgerSequenceSpecification } from '../specifications/ledger-sequence.specification';
import { MovementStatusEnum } from '../value-objects/movement-status.value-object';

export class LedgerAppendPolicy {
  public static validateAppend(movements: StockMovement[], newMovement: StockMovement): void {
    const lastMovement = movements.length > 0 ? movements[movements.length - 1] : undefined;
    
    // Validate sequence monotonicity
    LedgerSequenceSpecification.isSatisfiedBy(lastMovement, newMovement);

    // Validate duplicate IDs
    const isDuplicate = movements.some(m => m.id === newMovement.id);
    if (isDuplicate) {
      throw new Error(`Duplicate movement ID detected: ${newMovement.id}`);
    }

    // By default, appending a movement starts it as PENDING or COMPLETED
    if (newMovement.status.value === MovementStatusEnum.CANCELLED) {
      throw new Error('Cannot append a new movement with CANCELLED status. Append as PENDING or COMPLETED first.');
    }
  }
}
