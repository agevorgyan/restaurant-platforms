import { ReservationCustomerResolver } from '../services/reservation-customer.resolver';
import { ReservationCustomerGateway } from '../services/reservation-customer.gateway';
import { ReservationCustomerRequest } from '../value-objects/reservation-customer-request.value-object';
import { ReservationReference } from '../value-objects/reservation-reference.value-object';
import { CustomerReference } from '../value-objects/customer-reference.value-object';
import { GuestReference } from '../value-objects/guest-reference.value-object';
import { BranchReference } from '../value-objects/branch-reference.value-object';
import { BusinessDate } from '../value-objects/business-date.value-object';
import { ReservationCustomerCorrelationId } from '../value-objects/reservation-customer-correlation-id.value-object';
import { EventPublisher } from '../../shared/interfaces/event-publisher.interface';

describe('ReservationCustomerResolver', () => {
  let resolver: ReservationCustomerResolver;
  let mockGateway: jest.Mocked<ReservationCustomerGateway>;
  let mockPublisher: jest.Mocked<EventPublisher>;

  beforeEach(() => {
    mockGateway = { fetchCustomerProfile: jest.fn() };
    mockPublisher = { publish: jest.fn(), publishAll: jest.fn() };
    resolver = new ReservationCustomerResolver(mockGateway, mockPublisher);
  });

  const createRequest = (isGuest = false) => {
    return ReservationCustomerRequest.create({
      reservationRef: ReservationReference.create('res-1'),
      customerRef: isGuest ? undefined : CustomerReference.create('cust-1'),
      guestRef: isGuest ? GuestReference.create('guest-1', 'John Doe') : undefined,
      branchRef: BranchReference.create('branch-1'),
      businessDateTime: BusinessDate.create(new Date()),
      correlationId: ReservationCustomerCorrelationId.create('corr-1')
    });
  };

  it('should resolve registered customer successfully', async () => {
    const request = createRequest(false);
    mockGateway.fetchCustomerProfile.mockResolvedValue({
      status: 'Registered',
      isLoyalty: true,
      preferredChannel: 'sms',
      stats: { total: 5, noShows: 0, cancellations: 1 }
    });

    const response = await resolver.resolve(request);

    expect(response.eligibility.isEligible).toBe(true);
    expect(response.guestStatus).toBe('Registered');
    expect(response.loyaltyIndicator).toBe(true);
    expect(response.statistics?.totalReservations).toBe(5);
    expect(mockPublisher.publish).toHaveBeenCalled();
  });

  it('should resolve guest successfully', async () => {
    const request = createRequest(true);
    mockGateway.fetchCustomerProfile.mockResolvedValue({
      status: 'Guest',
      isLoyalty: false,
      preferredChannel: 'email'
    });

    const response = await resolver.resolve(request);

    expect(response.eligibility.isEligible).toBe(true);
    expect(response.guestStatus).toBe('Guest');
    expect(response.loyaltyIndicator).toBe(false);
  });

  it('should mark suspended customer as ineligible', async () => {
    const request = createRequest(false);
    mockGateway.fetchCustomerProfile.mockResolvedValue({
      status: 'Registered',
      isSuspended: true
    });

    const response = await resolver.resolve(request);

    expect(response.eligibility.isEligible).toBe(false);
    expect(response.eligibility.reason).toContain('suspended');
  });

  it('should throw error and publish failed event if gateway throws', async () => {
    const request = createRequest(false);
    mockGateway.fetchCustomerProfile.mockRejectedValue(new Error('Network error'));

    await expect(resolver.resolve(request)).rejects.toThrow('Customer Integration Failed: Network error');
    expect(mockPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ reason: 'Network error' })
    );
  });
});