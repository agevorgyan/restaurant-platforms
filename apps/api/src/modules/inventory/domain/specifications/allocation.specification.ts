import { Inventory } from '../aggregates/inventory.aggregate';
import { AllocationRequest } from '../value-objects/allocation-request.value-object';

export class AllocationSpecification {
  public static isSatisfiedBy(inventory: Inventory, request: AllocationRequest): boolean {
    if (inventory.id !== request.inventoryId) {
      throw new Error(`Inventory ID mismatch. Expected ${request.inventoryId}, got ${inventory.id}`);
    }

    // Allocation consumes reserved quantity. Ensure we don't allocate more than we have reserved for this order!
    // But what if it's a direct allocation without reservation? The rules say "Allocation consumes Reserved quantity."
    // We must check if there is an active reservation.
    const activeReservation = inventory.reservations.find(
      (r) => r.orderReference.value === request.orderId.value && !r.isReleased
    );

    if (!activeReservation) {
      throw new Error(`No active reservation found for order ${request.orderId.value}. Must reserve before allocating.`);
    }

    if (activeReservation.quantity.value < request.quantity.value) {
      throw new Error(`Cannot allocate more than reserved. Reserved: ${activeReservation.quantity.value}, Requested Allocation: ${request.quantity.value}`);
    }

    return true;
  }
}
