import { ValueObject } from '@saas/core';

export interface AvailabilityReasonProps { reason: string; }
export class AvailabilityReason extends ValueObject<AvailabilityReasonProps> {
  get reason(): string { return this.props.reason; }
  private constructor(props: AvailabilityReasonProps) { super(props); }
  public static create(reason: string): AvailabilityReason { return new AvailabilityReason({ reason }); }
}