
import { AssignmentDecision } from '../value-objects/assignment-decision.value-object';
import { AssignmentReason } from '../value-objects/assignment-reason.value-object';
import { SeatingPlan } from '../value-objects/seating-plan.value-object';

export class TableAssignmentResolver {
  public resolveApproval(plan: SeatingPlan): AssignmentDecision {
    return AssignmentDecision.create({
      approved: true,
      rejected: false,
      suggestedTableReferences: [...plan.tables],
      assignedCapacity: plan.totalCapacity,
      reasons: [AssignmentReason.create('Optimal capacity matched')]
    });
  }

  public resolveRejection(reasons: AssignmentReason[]): AssignmentDecision {
    return AssignmentDecision.create({
      approved: false,
      rejected: true,
      suggestedTableReferences: [],
      assignedCapacity: 0,
      reasons
    });
  }
}