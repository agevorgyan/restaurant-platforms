import { TableAssignmentContext } from '../contexts/table-assignment.context';
import { SeatingPlan } from '../value-objects/seating-plan.value-object';

export class TableCapacitySpecification {
  public isSatisfiedBy(plan: SeatingPlan, requiredCapacity: number): boolean {
    return plan.totalCapacity >= requiredCapacity;
  }
}

export class AssignmentSpecification {
  public isSatisfiedBy(context: TableAssignmentContext): boolean {
    return context.requiredCapacity.required > 0 && context.reservationDuration.minutes > 0;
  }
}

export class ReservationConflictSpecification {
  public isSatisfiedBy(existingAllocations: any[], proposedStartTime: Date, proposedEndTime: Date): boolean {
    return !existingAllocations.some(a => {
      return (proposedStartTime < a.endTime && proposedEndTime > a.startTime);
    });
  }
}

export class SeatingSpecification {
  public isSatisfiedBy(plan: SeatingPlan): boolean {
    return plan.tables.length > 0;
  }
}

export class CapacityConsistencySpecification {
  public isSatisfiedBy(assignedCapacity: number, requiredCapacity: number): boolean {
    return assignedCapacity >= requiredCapacity;
  }
}