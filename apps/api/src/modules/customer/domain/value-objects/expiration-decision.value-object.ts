import { ValueObject } from '@saas/core';
import { PointsAmount } from './points-amount.value-object';
import { RuleReason } from './rule-reason.value-object';

export interface ExpirationDecisionProps {
  amountToExpire: PointsAmount;
  reasons: RuleReason[];
}

export class ExpirationDecision extends ValueObject<ExpirationDecisionProps> {
  get amountToExpire(): PointsAmount { return this.props.amountToExpire; }
  get reasons(): RuleReason[] { return this.props.reasons; }
  private constructor(props: ExpirationDecisionProps) { super(props); }
  public static create(props: ExpirationDecisionProps): ExpirationDecision {
    return new ExpirationDecision(props);
  }
}