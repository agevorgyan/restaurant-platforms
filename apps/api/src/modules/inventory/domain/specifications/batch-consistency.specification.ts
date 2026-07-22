import { InventoryBatch } from '../entities/inventory-batch.entity';

export class BatchConsistencySpecification {
  public static isSatisfiedBy(batches: InventoryBatch[], newBatch: InventoryBatch): boolean {
    // Check for duplicate active batch numbers
    const isDuplicate = batches.some(
      batch => batch.isActive && 
               batch.id !== newBatch.id && 
               batch.batchNumber.value === newBatch.batchNumber.value
    );

    if (isDuplicate) {
      throw new Error(`Duplicate active batch number: ${newBatch.batchNumber.value}`);
    }

    return true;
  }
}
