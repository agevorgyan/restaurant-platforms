import { AvailabilityContext } from '../../value-objects/availability-context.value-object';
import { AvailabilityResult } from '../../value-objects/availability-result.value-object';
import { AvailabilityPolicyEngine } from './availability-policy.engine';
import { AvailabilityEvaluatedEvent } from '../../events/availability.events';
import { AvailabilityEvaluationId } from '../../value-objects/availability-evaluation-id.value-object';

export class AvailabilityEvaluationService {
  private readonly policyEngine: AvailabilityPolicyEngine;

  constructor() {
    this.policyEngine = new AvailabilityPolicyEngine();
  }

  public evaluate(context: AvailabilityContext): { result: AvailabilityResult, event: AvailabilityEvaluatedEvent } {
    const result = this.policyEngine.runPolicies(context);
    const evaluationId = AvailabilityEvaluationId.create().value;
    const event = new AvailabilityEvaluatedEvent(evaluationId, context.branchReference, result.decision.status);
    return { result, event };
  }
}