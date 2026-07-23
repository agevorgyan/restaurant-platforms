import { ReservationCustomerRequest } from '../value-objects/reservation-customer-request.value-object';
import { CustomerEligibility } from '../value-objects/customer-eligibility.value-object';

export class CustomerReferenceSpecification {
  public isSatisfiedBy(request: ReservationCustomerRequest): boolean {
    return !!request.customerRef || !!request.guestRef;
  }
}

export class ReservationCustomerSpecification {
  public isSatisfiedBy(request: ReservationCustomerRequest): boolean {
    return !!request.reservationRef && !!request.branchRef;
  }
}

export class CustomerEligibilitySpecification {
  public isSatisfiedBy(eligibility: CustomerEligibility): boolean {
    return eligibility.isEligible;
  }
}

export class GuestReservationSpecification {
  public isSatisfiedBy(request: ReservationCustomerRequest): boolean {
    // Only allow guest refs if customer ref is not present
    return !request.customerRef && !!request.guestRef;
  }
}

export class CustomerContractSpecification {
  public isSatisfiedBy(version: string): boolean {
    return version === '1.0'; // Example version pin
  }
}