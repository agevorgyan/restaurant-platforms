import { ValueObject } from '@saas/core';

export interface AvailabilityReasonProps { value: string; }

export class AvailabilityReason extends ValueObject<AvailabilityReasonProps> {
  get value(): string { return this.props.value; }
  private constructor(props: AvailabilityReasonProps) { super(props); }
  public static create(value: string): AvailabilityReason {
    return new AvailabilityReason({ value: value.trim() });
  }
}