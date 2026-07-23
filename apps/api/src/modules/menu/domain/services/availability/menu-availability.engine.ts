import { AvailabilityContextProps } from '../../value-objects/availability-context.value-object';
import { AvailabilityContextFactory } from './availability-context.factory';
import { AvailabilityEvaluationService } from './availability-evaluation.service';
import { AvailabilityResult } from '../../value-objects/availability-result.value-object';
import { AvailabilityEvaluatedEvent } from '../../events/availability.events';

export class MenuAvailabilityEngine {
  private readonly evaluationService: AvailabilityEvaluationService;

  constructor() {
    this.evaluationService = new AvailabilityEvaluationService();
  }

  public execute(props: AvailabilityContextProps): { result: AvailabilityResult, event: AvailabilityEvaluatedEvent } {
    // Engine is Pure, Stateless, Deterministic, and Side-effect free
    // Validation is done on Context creation
    const context = AvailabilityContextFactory.createFromRequest(props);
    return this.evaluationService.evaluate(context);
  }
}