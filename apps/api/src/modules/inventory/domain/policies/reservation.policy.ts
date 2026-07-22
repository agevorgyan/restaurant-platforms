import { Inventory } from '../aggregates/inventory.aggregate';
import { InventoryReservation } from '../entities/inventory-reservation.entity';
import { ReservationConsistencySpecification } from '../specifications/reservation-consistency.specification';

export class ReservationPolicy {
  public static placeReservation(inventory: Inventory, reservation: InventoryReservation): void {
    // Validate reservation limit and duplicates
    ReservationConsistencySpecification.isSatisfiedBy(inventory, reservation);

    // Apply the reservation
    inventory.addReservation(reservation);

    // Add Domain Event via aggregate logic later if preferred, or trigger here
    // Usually, aggregate root should trigger it. The policy validates and applies.
  }

  public static releaseReservation(inventory: Inventory, reservationId: string): void {
    inventory.releaseReservation(reservationId);
  }
}
