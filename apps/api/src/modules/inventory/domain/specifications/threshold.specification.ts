import { Inventory } from '../aggregates/inventory.aggregate';

export class ThresholdSpecification {
  public static isLowStock(inventory: Inventory): boolean {
    if (!inventory.threshold || !inventory.threshold.reorderLevel) {
      return false;
    }
    return inventory.availableQuantity.quantity.isLessThanOrEqual(inventory.threshold.reorderLevel.quantity);
  }

  public static isOutOfStock(inventory: Inventory): boolean {
    return inventory.availableQuantity.quantity.isZero();
  }
}
