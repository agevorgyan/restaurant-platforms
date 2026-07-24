import { Specification } from '@saas/domain-rules';
import { AvailabilityPeriod } from '../value-objects/availability-period';

export interface AvailabilityPeriodContext {
  period: AvailabilityPeriod;
}

export class AvailabilityPeriodSpecification extends Specification<AvailabilityPeriodContext> {
  public isSatisfiedBy(candidate: AvailabilityPeriodContext): boolean {
    const start = candidate.period.toValue().startDate;
    const end = candidate.period.toValue().endDate;
    return start < end;
  }
}

export interface VacationBalanceContext {
  currentBalance: number;
  requestedDays: number;
}

export class VacationBalanceSpecification extends Specification<VacationBalanceContext> {
  public isSatisfiedBy(candidate: VacationBalanceContext): boolean {
    return (candidate.currentBalance - candidate.requestedDays) >= 0;
  }
}

export interface LeaveConflictContext {
  hasConflicts: boolean;
}

export class LeaveConflictSpecification extends Specification<LeaveConflictContext> {
  public isSatisfiedBy(candidate: LeaveConflictContext): boolean {
    return !candidate.hasConflicts;
  }
}

export interface ApprovalRequiredContext {
  type: string;
}

export class ApprovalRequiredSpecification extends Specification<ApprovalRequiredContext> {
  public isSatisfiedBy(candidate: ApprovalRequiredContext): boolean {
    // Vacation and Unpaid require approval, Sick leave might just be recorded
    return candidate.type === 'VACATION' || candidate.type === 'UNPAID_LEAVE';
  }
}
