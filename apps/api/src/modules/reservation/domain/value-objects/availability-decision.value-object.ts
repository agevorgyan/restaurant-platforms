import { ValueObject } from '@saas/core';
import { AvailabilityReason } from './availability-reason.value-object';
import { AvailableSlots } from './available-slots.value-object';
import { CapacityForecast } from './capacity-forecast.value-object';
import { BusinessDate } from './business-date.value-object';

export interface AvailabilityDecisionProps {
  available: boolean;
  unavailable: boolean;
  suggestedTimeSlots: AvailableSlots;
  suggestedDates: BusinessDate[];
  reason?: AvailabilityReason;
  capacityForecast: CapacityForecast;
}

export class AvailabilityDecision extends ValueObject<AvailabilityDecisionProps> {
  get available(): boolean { return this.props.available; }
  get unavailable(): boolean { return this.props.unavailable; }
  get suggestedTimeSlots(): AvailableSlots { return this.props.suggestedTimeSlots; }
  get suggestedDates(): ReadonlyArray<BusinessDate> { return this.props.suggestedDates; }
  get reason(): AvailabilityReason | undefined { return this.props.reason; }
  get capacityForecast(): CapacityForecast { return this.props.capacityForecast; }

  private constructor(props: AvailabilityDecisionProps) { super(props); }
  public static create(props: AvailabilityDecisionProps): AvailabilityDecision { return new AvailabilityDecision(props); }
}