import { Inventory } from '../aggregates/inventory.aggregate';
import { ThresholdSpecification } from '../specifications/threshold.specification';
import { InventoryLowStockEvent, InventoryOutOfStockEvent } from '../events/inventory.events';
import { DomainEvent } from '@saas/core';

export class ThresholdPolicy {
  public static checkThresholds(inventory: Inventory): DomainEvent[] {
    const events: DomainEvent[] = [];
    if (ThresholdSpecification.isOutOfStock(inventory)) {
      events.push(
        new InventoryOutOfStockEvent(inventory.id, inventory.restaurantId)
      );
    } else if (ThresholdSpecification.isLowStock(inventory)) {
      if (inventory.threshold && inventory.threshold.reorderLevel) {
        events.push(
          new InventoryLowStockEvent(
            inventory.id,
            inventory.restaurantId,
            inventory.availableQuantity.quantity.value,
            inventory.threshold.reorderLevel.quantity.value
          )
        );
      }
    }
    return events;
  }
}
