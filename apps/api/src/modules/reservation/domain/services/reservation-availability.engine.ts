import { AvailabilityContext } from '../contexts/availability.context';
import { AvailabilityDecision } from '../value-objects/availability-decision.value-object';
import { BusinessHours } from '../value-objects/business-hours.value-object';
import { ReservationWindow } from '../value-objects/reservation-window.value-object';
import { BlockedPeriod } from '../value-objects/blocked-period.value-object';
import { CapacityForecast } from '../value-objects/capacity-forecast.value-object';
import { AvailableSlots } from '../value-objects/available-slots.value-object';

import { BusinessHoursValidationService } from './availability-evaluation.service';
import { ReservationWindowService } from './reservation-window.service';
import { CapacityForecastService } from './capacity-forecast.service';
import { AvailabilityRuleResolver } from './availability-rule.resolver';

import { AvailabilityPolicy, BlockedPeriodPolicy } from '../policies/availability.policies';
import { BlockedPeriodSpecification, AvailabilitySpecification } from '../specifications/availability.specifications';
import { EventPublisher } from '../../shared/interfaces/event-publisher.interface';
import { 
  AvailabilityEvaluationStartedEvent,
  AvailabilityEvaluationCompletedEvent,
  AvailabilityRejectedEvent,
  BusinessHoursValidatedEvent,
  ReservationWindowValidatedEvent,
  CapacityForecastCalculatedEvent
} from '../events/availability.events';
import { ReservationDomainError } from '../exceptions/reservation.exceptions';

export class ReservationAvailabilityEngine {
  private readonly businessHoursService = new BusinessHoursValidationService();
  private readonly windowService = new ReservationWindowService();
  private readonly forecastService = new CapacityForecastService();
  private readonly ruleResolver = new AvailabilityRuleResolver();
  
  private readonly blockoutSpec = new BlockedPeriodSpecification();
  private readonly baseSpec = new AvailabilitySpecification();

  constructor(private readonly eventPublisher: EventPublisher) {}

  public evaluate(
    context: AvailabilityContext,
    businessHours: BusinessHours,
    reservationWindow: ReservationWindow,
    blockedPeriods: BlockedPeriod[],
    capacityForecast: CapacityForecast
  ): AvailabilityDecision {
    
    this.eventPublisher.publish(new AvailabilityEvaluationStartedEvent(context.branchRef.branchId));
    
    try {
      // Base validation
      if (!this.baseSpec.isSatisfiedBy(context)) throw new ReservationDomainError('Invalid context');
      AvailabilityPolicy.enforce(context);

      // 1. Business Hours
      this.businessHoursService.validate(context, businessHours);
      this.eventPublisher.publish(new BusinessHoursValidatedEvent(context.branchRef.branchId));

      // 2 & 3. Reservation Window & Lead Time
      this.windowService.validate(context, reservationWindow);
      this.eventPublisher.publish(new ReservationWindowValidatedEvent(context.branchRef.branchId));

      // 4. Blackout Period Validation
      const isNotBlocked = this.blockoutSpec.isSatisfiedBy(context, blockedPeriods);
      BlockedPeriodPolicy.enforce(isNotBlocked);

      // 5. Capacity Forecast
      this.forecastService.validateAndForecast(context, capacityForecast);
      this.eventPublisher.publish(new CapacityForecastCalculatedEvent(context.branchRef.branchId, capacityForecast.availableCapacity));

      // 6. Availability Decision (Approved)
      const decision = this.ruleResolver.resolveApproval(capacityForecast, AvailableSlots.create([]));
      this.eventPublisher.publish(new AvailabilityEvaluationCompletedEvent(context.branchRef.branchId, true));
      return decision;

    } catch (error) {
      if (error instanceof ReservationDomainError) {
        const decision = this.ruleResolver.resolveRejection(error.message, capacityForecast);
        this.eventPublisher.publish(new AvailabilityRejectedEvent(context.branchRef.branchId, error.message));
        this.eventPublisher.publish(new AvailabilityEvaluationCompletedEvent(context.branchRef.branchId, false));
        return decision;
      }
      throw error; // System failure
    }
  }
}