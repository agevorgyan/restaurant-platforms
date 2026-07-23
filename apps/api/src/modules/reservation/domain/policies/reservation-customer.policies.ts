import { ReservationCustomerRequest } from '../value-objects/reservation-customer-request.value-object';
import { ReservationDomainError } from '../exceptions/reservation.exceptions';

export class ReservationCustomerIntegrationPolicy {
  public static enforce(request: ReservationCustomerRequest): void {
    if (!request.correlationId) {
      throw new ReservationDomainError('Correlation ID is required for cross-context integration');
    }
  }
}

export class CustomerEligibilityPolicy {
  public static enforce(isEligible: boolean): void {
    if (!isEligible) throw new ReservationDomainError('Customer is not eligible to make a reservation (e.g. banned)');
  }
}

export class GuestReservationPolicy {
  public static enforce(isWalkInOrValidGuest: boolean): void {
    if (!isWalkInOrValidGuest) throw new ReservationDomainError('Invalid guest reference scenario');
  }
}

export class ReservationOwnershipPolicy {
  public static enforceNoProfileMutation(): void {
    // Structural policy: Domain services in this context must not return entities that map to Customer profile mutations
  }
}

export class CustomerReferencePolicy {
  public static enforce(hasValidRef: boolean): void {
    if (!hasValidRef) throw new ReservationDomainError('Request must provide either a CustomerReference or a GuestReference');
  }
}