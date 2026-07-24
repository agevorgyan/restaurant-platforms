import { Specification } from '@saas/domain-rules';

export interface EmployeeAvailabilityContext {
  isAvailable: boolean;
  hasOverlappingShifts: boolean;
  exceedsWeeklyHours: boolean;
}

export class EmployeeAvailableSpecification extends Specification<EmployeeAvailabilityContext> {
  public isSatisfiedBy(candidate: EmployeeAvailabilityContext): boolean {
    return candidate.isAvailable && !candidate.hasOverlappingShifts && !candidate.exceedsWeeklyHours;
  }
}

export interface ShiftCapacityContext {
  currentAssignedCount: number;
  maximumCapacity: number;
}

export class ShiftCapacitySpecification extends Specification<ShiftCapacityContext> {
  public isSatisfiedBy(candidate: ShiftCapacityContext): boolean {
    return candidate.currentAssignedCount < candidate.maximumCapacity;
  }
}

export interface ShiftTimeContext {
  startTime: Date;
  endTime: Date;
}

export class ShiftTimeSpecification extends Specification<ShiftTimeContext> {
  public isSatisfiedBy(candidate: ShiftTimeContext): boolean {
    return candidate.startTime < candidate.endTime;
  }
}
