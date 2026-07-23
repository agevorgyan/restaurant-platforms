import { TableAssignmentContext } from '../contexts/table-assignment.context';
import { ReservationDomainError } from '../exceptions/reservation.exceptions';

export class TableAssignmentPolicy {
  public static enforce(context: TableAssignmentContext): void {
    if (context.requiredCapacity.required <= 0) {
      throw new ReservationDomainError('Required capacity must be strictly greater than 0');
    }
  }
}

export class CapacityPolicy {
  public static enforce(assignedCapacity: number, requiredCapacity: number): void {
    if (assignedCapacity < requiredCapacity) {
      throw new ReservationDomainError('Assigned capacity cannot be less than required capacity');
    }
  }
}

export class ConflictResolutionPolicy {
  public static resolve(hasConflict: boolean): void {
    if (hasConflict) {
      throw new ReservationDomainError('Cannot assign tables due to reservation overlap');
    }
  }
}

export class SeatingOptimizationPolicy {
  public static evaluate(tablesAssigned: number): void {
    if (tablesAssigned === 0) {
      throw new ReservationDomainError('At least one table must be assigned');
    }
  }
}

export class ReservationAllocationPolicy {
  public static enforceImmutableOutput(decision: any): void {
    if (!decision || typeof decision !== 'object') {
      throw new ReservationDomainError('Assignment decision must be immutable and deterministic');
    }
  }
}