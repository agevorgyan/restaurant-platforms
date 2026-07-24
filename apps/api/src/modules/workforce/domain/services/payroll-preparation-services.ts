import { IDomainService } from '@saas/domain';
import { PayrollPreparation } from '../aggregates/payroll-preparation';
import { PayrollValidationIssue } from '../entities/payroll-validation-issue';

export class AttendanceSummaryService implements IDomainService {
  public validateSummaryData(hours: number): boolean {
    return hours >= 0 && hours <= 744; // Max hours in a 31-day month
  }
}

export class ShiftSummaryService implements IDomainService {
  public validateShiftData(assigned: number, completed: number, missed: number): boolean {
    return assigned === (completed + missed);
  }
}

export class PayrollPreparationValidationService implements IDomainService {
  public validate(preparation: PayrollPreparation): PayrollValidationIssue[] {
    const issues: PayrollValidationIssue[] = [];

    if (preparation.attendanceSummaries.length === 0) {
      issues.push(PayrollValidationIssue.create(
        'Payroll preparation contains no attendance summaries.',
        'ERROR'
      ));
    }

    const unapprovedAbsences = preparation.attendanceSummaries.filter(s => s.unapprovedAbsenceHours.toValue() > 0);
    unapprovedAbsences.forEach(summary => {
      issues.push(PayrollValidationIssue.create(
        `Staff member has unapproved absence hours: ${summary.unapprovedAbsenceHours.toValue()}`,
        'WARNING',
        summary.staffId.toValue()
      ));
    });

    return issues;
  }
}

export class PayrollExportService implements IDomainService {
  public formatForExport(preparation: PayrollPreparation, format: string): any {
    // In a real system, this maps domain entities to export-specific DTOs
    return {
      preparationId: preparation.id.toValue(),
      period: preparation.period.toValue(),
      summariesCount: preparation.attendanceSummaries.length,
      format
    };
  }
}
