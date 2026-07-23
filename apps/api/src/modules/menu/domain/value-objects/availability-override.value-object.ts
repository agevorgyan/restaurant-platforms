import { ValueObject } from '@saas/core';
import { AvailabilityDecision } from './availability-decision.value-object';
import { AvailabilityReason } from './availability-reason.value-object';

export interface AvailabilityOverrideProps {
  decision: AvailabilityDecision;
  reason: AvailabilityReason;
}

export class AvailabilityOverride extends ValueObject<AvailabilityOverrideProps> {
  get decision(): AvailabilityDecision { return this.props.decision; }
  get reason(): AvailabilityReason { return this.props.reason; }

  private constructor(props: AvailabilityOverrideProps) { super(props); }

  public static create(decision: AvailabilityDecision, reason: AvailabilityReason): AvailabilityOverride {
    return new AvailabilityOverride({ decision, reason });
  }
}