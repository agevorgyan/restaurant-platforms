import { ValueObject } from '@saas/core';

export interface AvailabilityPriorityProps { priorityLevel: number; }
export class AvailabilityPriority extends ValueObject<AvailabilityPriorityProps> {
  get priorityLevel(): number { return this.props.priorityLevel; }
  private constructor(props: AvailabilityPriorityProps) { super(props); }
  public static create(priorityLevel: number): AvailabilityPriority { return new AvailabilityPriority({ priorityLevel }); }
}