import { ValueObject } from '@saas/core';
import { AvailabilityDecision } from './availability-decision.value-object';
import { AvailabilityReason } from './availability-reason.value-object';
import { AvailabilityPriority } from './availability-priority.value-object';

export interface AvailabilityResultProps {
  decision: AvailabilityDecision;
  reason: AvailabilityReason;
  priority: AvailabilityPriority;
}

export class AvailabilityResult extends ValueObject<AvailabilityResultProps> {
  get decision(): AvailabilityDecision { return this.props.decision; }
  get reason(): AvailabilityReason { return this.props.reason; }
  get priority(): AvailabilityPriority { return this.props.priority; }

  private constructor(props: AvailabilityResultProps) { super(props); }

  public static create(props: AvailabilityResultProps): AvailabilityResult {
    return new AvailabilityResult(props);
  }
}