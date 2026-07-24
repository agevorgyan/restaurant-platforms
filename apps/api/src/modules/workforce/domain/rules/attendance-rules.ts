import { Specification } from '@saas/domain-rules';

export interface AttendanceCompletedContext {
  status: string;
  hasCheckOutTime: boolean;
}

export class AttendanceCompletedSpecification extends Specification<AttendanceCompletedContext> {
  public isSatisfiedBy(candidate: AttendanceCompletedContext): boolean {
    return candidate.status === 'COMPLETED' && candidate.hasCheckOutTime;
  }
}

export interface WorkingHoursContext {
  checkInTime: Date;
  checkOutTime: Date;
  expectedStartTime: Date;
  expectedEndTime: Date;
}

export class WorkingHoursSpecification extends Specification<WorkingHoursContext> {
  public isSatisfiedBy(candidate: WorkingHoursContext): boolean {
    // Simply ensuring check out is after check in for the base check
    return candidate.checkOutTime > candidate.checkInTime;
  }
}

export interface BreakDurationContext {
  actualBreakDurationMinutes: number;
  allowedBreakDurationMinutes: number;
}

export class BreakDurationSpecification extends Specification<BreakDurationContext> {
  public isSatisfiedBy(candidate: BreakDurationContext): boolean {
    return candidate.actualBreakDurationMinutes <= candidate.allowedBreakDurationMinutes;
  }
}

export interface CorrectionAllowedContext {
  status: string;
}

export class CorrectionAllowedSpecification extends Specification<CorrectionAllowedContext> {
  public isSatisfiedBy(candidate: CorrectionAllowedContext): boolean {
    // Cannot correct if locked (e.g. for payroll)
    return candidate.status !== 'LOCKED';
  }
}
