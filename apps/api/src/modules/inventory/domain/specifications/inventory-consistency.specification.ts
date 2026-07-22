import { Inventory } from '../aggregates/inventory.aggregate';

export class InventoryConsistencySpecification {
  public static isSatisfiedBy(inventory: Inventory): boolean {
    if (inventory.onHandQuantity.quantity.value < 0) {
      throw new Error('Inventory on-hand quantity cannot be negative');
    }

    if (inventory.reservedQuantity.quantity.value < 0) {
      throw new Error('Inventory reserved quantity cannot be negative');
    }

    if (inventory.availableQuantity.quantity.value < 0) {
      throw new Error('Inventory available quantity cannot be negative');
    }

    // Available = OnHand - Reserved
    const expectedAvailable = inventory.onHandQuantity.quantity.subtract(inventory.reservedQuantity.quantity);
    if (inventory.availableQuantity.quantity.value !== expectedAvailable.value) {
      throw new Error('Inventory available quantity must equal on-hand minus reserved');
    }

    return true;
  }
}
