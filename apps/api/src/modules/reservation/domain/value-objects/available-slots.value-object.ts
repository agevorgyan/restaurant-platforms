import { ValueObject } from '@saas/core';
import { BusinessTime } from './business-time.value-object';

export interface AvailableSlotsProps { slots: BusinessTime[]; }
export class AvailableSlots extends ValueObject<AvailableSlotsProps> {
  get slots(): ReadonlyArray<BusinessTime> { return this.props.slots; }
  private constructor(props: AvailableSlotsProps) { super(props); }
  public static create(slots: BusinessTime[]): AvailableSlots { return new AvailableSlots({ slots }); }
}