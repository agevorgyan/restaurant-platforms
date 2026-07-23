import { ReservationCustomerRequest } from '../value-objects/reservation-customer-request.value-object';
import { GuestReservationSpecification } from '../specifications/reservation-customer.specifications';
import { GuestReservationPolicy } from '../policies/reservation-customer.policies';
import { GuestReference } from '../value-objects/guest-reference.value-object';

export class GuestResolutionService {
  private readonly spec = new GuestReservationSpecification();

  public resolve(request: ReservationCustomerRequest): GuestReference | undefined {
    if (request.customerRef) return undefined; // It's a registered customer

    const isGuest = this.spec.isSatisfiedBy(request);
    GuestReservationPolicy.enforce(isGuest);
    
    return request.guestRef;
  }
}