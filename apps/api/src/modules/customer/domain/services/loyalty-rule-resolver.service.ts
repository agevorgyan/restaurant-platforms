import { LoyaltyEvaluationContext } from '../value-objects/loyalty-evaluation-context.value-object';
import { RulePriority } from '../value-objects/rule-priority.value-object';

export class LoyaltyRuleResolver {
  public resolveExecutionOrder(context: LoyaltyEvaluationContext): RulePriority[] {
    void context;
    return [
      RulePriority.create(1),
      RulePriority.create(2)
    ];
  }
}