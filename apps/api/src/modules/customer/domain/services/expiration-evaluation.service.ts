import { LoyaltyEvaluationContext } from '../value-objects/loyalty-evaluation-context.value-object';
import { ExpirationDecision } from '../value-objects/expiration-decision.value-object';
import { PointsAmount } from '../value-objects/points-amount.value-object';

export class ExpirationEvaluationService {
  public evaluate(context: LoyaltyEvaluationContext): ExpirationDecision {
    void context;
    return ExpirationDecision.create({
      amountToExpire: PointsAmount.create(0),
      reasons: []
    });
  }
}