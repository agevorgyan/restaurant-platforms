import { ReservationCustomerResponse } from '../value-objects/reservation-customer-response.value-object';
import { CustomerEligibility } from '../value-objects/customer-eligibility.value-object';
import { CustomerReservationStatistics } from '../value-objects/customer-reservation-statistics.value-object';

export class ReservationCustomerMapper {
  public mapToResponse(externalData: any, eligibility: CustomerEligibility): ReservationCustomerResponse {
    return ReservationCustomerResponse.create({
      eligibility,
      statistics: externalData.stats ? CustomerReservationStatistics.create(
        externalData.stats.total,
        externalData.stats.noShows,
        externalData.stats.cancellations
      ) : undefined,
      guestStatus: externalData.status || 'Guest',
      loyaltyIndicator: !!externalData.isLoyalty,
      preferredCommunicationChannel: externalData.preferredChannel || 'email'
    });
  }
}