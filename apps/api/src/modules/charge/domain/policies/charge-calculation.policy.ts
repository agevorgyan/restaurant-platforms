import { ChargePolicy } from '../aggregates/charge-policy.aggregate';
import { ChargeRule } from '../entities/charge-rule.entity';
import { ChargeConditionSpecification } from '../specifications/charge-condition.specification';
import { ChargeScheduleSpecification } from '../specifications/charge-schedule.specification';
import { ChargeConditionType } from '../entities/charge-condition.entity';
import { ChargeTargetType } from '../entities/charge-target.entity';

export interface ChargeEvaluationContext {
  conditions: Record<ChargeConditionType, any>;
  targets: Record<ChargeTargetType, string[]>;
  evaluationDate: Date;
}

export class ChargeCalculationPolicy {
  constructor(
    private readonly conditionSpec: ChargeConditionSpecification,
    private readonly scheduleSpec: ChargeScheduleSpecification
  ) {}

  public evaluateApplicableRules(policy: ChargePolicy, context: ChargeEvaluationContext): ChargeRule[] {
    return policy.rules.filter(rule => {
      // Check schedules
      if (!this.scheduleSpec.isSatisfiedBy(rule.schedules, context.evaluationDate)) {
        return false;
      }

      // Check conditions
      if (!this.conditionSpec.isSatisfiedBy(rule.conditions, context.conditions)) {
        return false;
      }

      // Check targets
      const matchesTarget = rule.targets.some(target => {
        const providedTargetValues = context.targets[target.type];
        if (!providedTargetValues) return false;
        
        // If target requires a specific value (e.g. specific PRODUCT ID)
        if (target.value) {
          return providedTargetValues.includes(target.value);
        }
        
        // If it just applies to the target type generally (e.g. DELIVERY)
        return providedTargetValues.length > 0;
      });

      return matchesTarget;
    });
  }
}
