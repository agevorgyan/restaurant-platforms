import { AvailabilityDecision } from '../value-objects/availability-decision.value-object';
import { AvailabilityReason } from '../value-objects/availability-reason.value-object';
import { CapacityForecast } from '../value-objects/capacity-forecast.value-object';
import { AvailableSlots } from '../value-objects/available-slots.value-object';

export class AvailabilityRuleResolver {
  public resolveApproval(forecast: CapacityForecast, slots: AvailableSlots): AvailabilityDecision {
    return AvailabilityDecision.create({
      available: true,
      unavailable: false,
      suggestedTimeSlots: slots,
      suggestedDates: [],
      capacityForecast: forecast
    });
  }

  public resolveRejection(reason: string, forecast: CapacityForecast): AvailabilityDecision {
    return AvailabilityDecision.create({
      available: false,
      unavailable: true,
      suggestedTimeSlots: AvailableSlots.create([]),
      suggestedDates: [],
      reason: AvailabilityReason.create(reason),
      capacityForecast: forecast
    });
  }
}