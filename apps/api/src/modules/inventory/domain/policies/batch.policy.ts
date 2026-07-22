import { Inventory } from '../aggregates/inventory.aggregate';
import { InventoryBatch } from '../entities/inventory-batch.entity';
import { BatchConsistencySpecification } from '../specifications/batch-consistency.specification';

export class BatchPolicy {
  public static ingestBatch(inventory: Inventory, batch: InventoryBatch): void {
    // Validate duplicate batch numbers
    BatchConsistencySpecification.isSatisfiedBy(inventory.batches, batch);

    // Apply the batch
    inventory.addBatch(batch);
  }
}
