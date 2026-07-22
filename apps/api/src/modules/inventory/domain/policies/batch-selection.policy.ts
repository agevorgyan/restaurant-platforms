import { InventoryBatch } from '../entities/inventory-batch.entity';
import { BatchAvailabilitySpecification } from '../specifications/batch-availability.specification';

export class BatchSelectionPolicy {
  public static validateBatchForAllocation(batch: InventoryBatch): void {
    BatchAvailabilitySpecification.isSatisfiedBy(batch);
  }
}
