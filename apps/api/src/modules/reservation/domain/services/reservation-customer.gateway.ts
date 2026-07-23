import { ReservationCustomerRequest } from '../value-objects/reservation-customer-request.value-object';

// Note: In Clean Architecture, this is the interface/port that Infrastructure will implement.
// The domain only defines the contract.

export interface ReservationCustomerGateway {
  fetchCustomerProfile(request: ReservationCustomerRequest): Promise<any>;
}