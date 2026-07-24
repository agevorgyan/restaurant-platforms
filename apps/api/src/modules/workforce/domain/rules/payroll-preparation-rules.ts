import { Specification } from '@saas/domain-rules';
import { PayrollPreparation } from '../aggregates/payroll-preparation';
import { PayrollAttendanceSummary } from '../entities/payroll-attendance-summary';
import { PayrollPeriod } from '../value-objects/payroll-period';
import { PreparationStatusEnum } from '../value-objects/preparation-status';

export class PreparationCompletenessSpecification extends Specification<PayrollPreparation> {
  public isSatisfiedBy(candidate: PayrollPreparation): boolean {
    return candidate.attendanceSummaries.length > 0;
  }
}

export class AttendanceApprovalSpecification extends Specification<PayrollAttendanceSummary> {
  public isSatisfiedBy(candidate: PayrollAttendanceSummary): boolean {
    return candidate.unapprovedAbsenceHours.toValue() === 0;
  }
}

export interface PayrollPeriodContext {
  newPeriod: PayrollPeriod;
  existingFinalizedPeriods: PayrollPeriod[];
}

export class PayrollPeriodSpecification extends Specification<PayrollPeriodContext> {
  public isSatisfiedBy(candidate: PayrollPeriodContext): boolean {
    return !candidate.existingFinalizedPeriods.some(p => p.overlaps(candidate.newPeriod));
  }
}

export class ExportReadinessSpecification extends Specification<PayrollPreparation> {
  public isSatisfiedBy(candidate: PayrollPreparation): boolean {
    return candidate.status.toValue() === PreparationStatusEnum.FINALIZED || candidate.status.toValue() === PreparationStatusEnum.EXPORTED;
  }
}
