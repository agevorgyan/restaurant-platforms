import { LoyaltyEvaluationContext } from '../value-objects/loyalty-evaluation-context.value-object';
import { PointsCalculation } from '../value-objects/points-calculation.value-object';
import { PointsAmount } from '../value-objects/points-amount.value-object';

export class PointsCalculationService {
  public calculate(context: LoyaltyEvaluationContext): PointsCalculation {
    // Pure function logic
    void context;
    return PointsCalculation.create({ amount: PointsAmount.create(0), reasons: [] });
  }
}