import { CapacityEvaluation } from '../value-objects/capacity-evaluation.value-object';
import { TableAssignmentContext } from '../contexts/table-assignment.context';

export class CapacityEvaluationService {
  public evaluate(context: TableAssignmentContext, availableTotal: number): CapacityEvaluation {
    const isSufficient = availableTotal >= context.requiredCapacity.required;
    const deficit = isSufficient ? 0 : context.requiredCapacity.required - availableTotal;
    return CapacityEvaluation.create(isSufficient, deficit);
  }
}