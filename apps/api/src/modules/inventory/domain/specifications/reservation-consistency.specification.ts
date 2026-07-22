import { InventoryReservation } from '../entities/inventory-reservation.entity';
import { Inventory } from '../aggregates/inventory.aggregate';

export class ReservationConsistencySpecification {
  public static isSatisfiedBy(inventory: Inventory, newReservation: InventoryReservation): boolean {
    // Cannot reserve if it exceeds available quantity
    if (newReservation.quantity.isGreaterThan(inventory.availableQuantity.quantity)) {
      throw new Error(`Reservation quantity ${newReservation.quantity.value} exceeds available quantity ${inventory.availableQuantity.quantity.value}`);
    }

    // Check for duplicate active reservations for the same order reference
    const isDuplicate = inventory.reservations.some(
      r => !r.isReleased &&
           r.id !== newReservation.id &&
           r.orderReference.value === newReservation.orderReference.value
    );

    if (isDuplicate) {
      throw new Error(`Duplicate active reservation for order: ${newReservation.orderReference.value}`);
    }

    return true;
  }
}
