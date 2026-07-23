import { ValueObject } from '@saas/core';
import { PointsAmount } from './points-amount.value-object';
import { RuleReason } from './rule-reason.value-object';

export interface PointsCalculationProps {
  amount: PointsAmount;
  reasons: RuleReason[];
}

export class PointsCalculation extends ValueObject<PointsCalculationProps> {
  get amount(): PointsAmount { return this.props.amount; }
  get reasons(): RuleReason[] { return this.props.reasons; }
  private constructor(props: PointsCalculationProps) { super(props); }
  public static create(props: PointsCalculationProps): PointsCalculation {
    return new PointsCalculation(props);
  }
}