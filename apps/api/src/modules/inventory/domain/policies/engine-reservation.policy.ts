import { Inventory } from '../aggregates/inventory.aggregate';
import { ReservationRequest } from '../value-objects/reservation-request.value-object';
import { ReservationSpecification } from '../specifications/reservation.specification';

export class EngineReservationPolicy {
  public static validateReservationRequest(inventory: Inventory, request: ReservationRequest): void {
    ReservationSpecification.isSatisfiedBy(inventory, request);
  }
}
