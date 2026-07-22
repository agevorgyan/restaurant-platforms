import { Inventory } from '../aggregates/inventory.aggregate';
import { ReservationRequest } from '../value-objects/reservation-request.value-object';

export class ReservationSpecification {
  public static isSatisfiedBy(inventory: Inventory, request: ReservationRequest): boolean {
    if (inventory.id !== request.inventoryId) {
      throw new Error(`Inventory ID mismatch. Expected ${request.inventoryId}, got ${inventory.id}`);
    }

    if (inventory.availableQuantity.quantity.value < request.quantity.value) {
      throw new Error(`Insufficient availability. Requested: ${request.quantity.value}, Available: ${inventory.availableQuantity.quantity.value}`);
    }

    // Check for duplicate reservation
    const existingReservation = inventory.reservations.find(
      (r) => r.orderReference.value === request.orderId.value
    );

    if (existingReservation && !existingReservation.isReleased) {
      throw new Error(`Duplicate active reservation exists for order ${request.orderId.value}`);
    }

    return true;
  }
}
