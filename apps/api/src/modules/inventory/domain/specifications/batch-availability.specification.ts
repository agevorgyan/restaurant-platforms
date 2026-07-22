import { InventoryBatch } from '../entities/inventory-batch.entity';

export class BatchAvailabilitySpecification {
  public static isSatisfiedBy(batch: InventoryBatch): boolean {
    if (!batch.isActive) {
      throw new Error(`Batch ${batch.id} is not active`);
    }

    const isExpired = batch.expirationDate ? batch.expirationDate.value < new Date() : false;
    if (isExpired) {
      throw new Error(`Batch ${batch.id} is expired`);
    }

    if (batch.quantity.value <= 0) {
      throw new Error(`Batch ${batch.id} has no available quantity`);
    }

    return true;
  }
}
