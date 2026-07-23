import { ReservationCustomerRequest } from '../value-objects/reservation-customer-request.value-object';
import { CustomerReferenceSpecification, ReservationCustomerSpecification } from '../specifications/reservation-customer.specifications';
import { CustomerReferencePolicy, ReservationCustomerIntegrationPolicy } from '../policies/reservation-customer.policies';

export class CustomerReservationPolicyEngine {
  private readonly customerSpec = new CustomerReferenceSpecification();
  private readonly reqSpec = new ReservationCustomerSpecification();

  public enforceInboundPolicies(request: ReservationCustomerRequest): void {
    ReservationCustomerIntegrationPolicy.enforce(request);
    
    const hasValidRef = this.customerSpec.isSatisfiedBy(request);
    CustomerReferencePolicy.enforce(hasValidRef);

    if (!this.reqSpec.isSatisfiedBy(request)) {
      throw new Error('Invalid Reservation Customer Request Structure');
    }
  }
}