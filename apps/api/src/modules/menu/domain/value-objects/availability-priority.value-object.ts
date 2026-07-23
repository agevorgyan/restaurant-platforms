import { ValueObject } from '@saas/core';

export interface AvailabilityPriorityProps { value: number; }

export class AvailabilityPriority extends ValueObject<AvailabilityPriorityProps> {
  get value(): number { return this.props.value; }
  private constructor(props: AvailabilityPriorityProps) { super(props); }
  public static create(value: number): AvailabilityPriority {
    if (value < 0) throw new Error('AvailabilityPriority must be non-negative');
    return new AvailabilityPriority({ value });
  }
}