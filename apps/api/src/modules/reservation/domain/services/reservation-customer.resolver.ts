import { ReservationCustomerRequest } from '../value-objects/reservation-customer-request.value-object';
import { ReservationCustomerResponse } from '../value-objects/reservation-customer-response.value-object';
import { ReservationCustomerGateway } from './reservation-customer.gateway';
import { CustomerEligibilityResolver } from './customer-eligibility.resolver';
import { ReservationCustomerMapper } from './reservation-customer.mapper';
import { CustomerReservationPolicyEngine } from './customer-reservation-policy.engine';
import { GuestResolutionService } from './guest-resolution.service';
import { EventPublisher } from '../../shared/interfaces/event-publisher.interface';
import {
  ReservationCustomerIntegrationStartedEvent,
  ReservationCustomerIntegrationCompletedEvent,
  ReservationCustomerIntegrationFailedEvent,
  CustomerEligibilityEvaluatedEvent,
  GuestResolvedEvent
} from '../events/reservation-customer.events';
import { ReservationDomainError } from '../exceptions/reservation.exceptions';

export class ReservationCustomerResolver {
  private readonly policyEngine = new CustomerReservationPolicyEngine();
  private readonly guestResolver = new GuestResolutionService();
  private readonly eligibilityResolver = new CustomerEligibilityResolver();
  private readonly mapper = new ReservationCustomerMapper();

  constructor(
    private readonly gateway: ReservationCustomerGateway,
    private readonly eventPublisher: EventPublisher
  ) {}

  public async resolve(request: ReservationCustomerRequest): Promise<ReservationCustomerResponse> {
    const { correlationId, reservationRef } = request;
    
    this.eventPublisher.publish(new ReservationCustomerIntegrationStartedEvent(correlationId.id, reservationRef.reference));

    try {
      // 1. Enforce Input Policies
      this.policyEngine.enforceInboundPolicies(request);

      // 2. Resolve Guest vs Customer
      const guestRef = this.guestResolver.resolve(request);
      if (guestRef) {
        this.eventPublisher.publish(new GuestResolvedEvent(correlationId.id, guestRef.guestId));
      }

      // 3. Gateway invocation (Inversion of Control)
      const externalData = await this.gateway.fetchCustomerProfile(request);

      // 4. Resolve Eligibility
      const eligibility = this.eligibilityResolver.resolve(externalData);
      this.eventPublisher.publish(new CustomerEligibilityEvaluatedEvent(correlationId.id, eligibility.isEligible));

      // 5. Map to internal Response
      const response = this.mapper.mapToResponse(externalData, eligibility);

      this.eventPublisher.publish(new ReservationCustomerIntegrationCompletedEvent(correlationId.id, reservationRef.reference));
      return response;

    } catch (error: any) {
      this.eventPublisher.publish(new ReservationCustomerIntegrationFailedEvent(correlationId.id, reservationRef.reference, error.message));
      throw new ReservationDomainError(`Customer Integration Failed: ${error.message}`);
    }
  }
}