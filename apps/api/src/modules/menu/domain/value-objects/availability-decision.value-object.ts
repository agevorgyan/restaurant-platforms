import { ValueObject } from '@saas/core';

export enum DecisionStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  LIMITED = 'LIMITED',
  HIDDEN = 'HIDDEN'
}

export interface AvailabilityDecisionProps { status: DecisionStatus; }

export class AvailabilityDecision extends ValueObject<AvailabilityDecisionProps> {
  get status(): DecisionStatus { return this.props.status; }
  private constructor(props: AvailabilityDecisionProps) { super(props); }
  public static create(status: DecisionStatus): AvailabilityDecision {
    return new AvailabilityDecision({ status });
  }
}