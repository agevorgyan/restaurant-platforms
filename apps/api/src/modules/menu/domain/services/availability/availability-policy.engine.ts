import { AvailabilityContext } from '../../value-objects/availability-context.value-object';
import { AvailabilityResult } from '../../value-objects/availability-result.value-object';
import { AvailabilityRuleResolver } from './availability-rule.resolver';
import { AvailabilityDecision, DecisionStatus } from '../../value-objects/availability-decision.value-object';
import { AvailabilityReason } from '../../value-objects/availability-reason.value-object';
import { AvailabilityPriority } from '../../value-objects/availability-priority.value-object';

export class AvailabilityPolicyEngine {
  private readonly ruleResolver: AvailabilityRuleResolver;

  constructor() {
    this.ruleResolver = new AvailabilityRuleResolver();
  }

  public runPolicies(context: AvailabilityContext): AvailabilityResult {
    const overrideResult = this.ruleResolver.resolveAll(context);
    if (overrideResult) {
      return overrideResult;
    }

    return AvailabilityResult.create({
      decision: AvailabilityDecision.create(DecisionStatus.AVAILABLE),
      reason: AvailabilityReason.create('Standard availability'),
      priority: AvailabilityPriority.create(10)
    });
  }
}