import { StockMovement } from '../entities/stock-movement.entity';

export class LedgerSequenceSpecification {
  public static isSatisfiedBy(lastMovement: StockMovement | undefined, newMovement: StockMovement): boolean {
    if (!lastMovement) {
      if (newMovement.sequence.value !== 1) {
        throw new Error('First ledger sequence must be 1');
      }
      return true;
    }

    if (newMovement.sequence.value !== lastMovement.sequence.value + 1) {
      throw new Error(`Invalid ledger sequence. Expected ${lastMovement.sequence.value + 1}, got ${newMovement.sequence.value}`);
    }

    return true;
  }
}
