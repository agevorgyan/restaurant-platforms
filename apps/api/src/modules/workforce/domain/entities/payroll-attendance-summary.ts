import { Entity, Identifier } from '@saas/domain';
import { StaffId } from '../value-objects/staff-id';
import { WorkedHours, RegularHours, OvertimeHours, NightHours, HolidayHours, ApprovedAbsenceHours, UnapprovedAbsenceHours } from '../value-objects/payroll-hours';

export class PayrollAttendanceSummaryId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PayrollAttendanceSummaryId { return new PayrollAttendanceSummaryId(value); }
  public static generate(): PayrollAttendanceSummaryId { return new PayrollAttendanceSummaryId(crypto.randomUUID()); }
}

export class PayrollAttendanceSummary extends Entity<PayrollAttendanceSummaryId> {
  constructor(
    id: PayrollAttendanceSummaryId,
    public readonly staffId: StaffId,
    public readonly workedHours: WorkedHours,
    public readonly regularHours: RegularHours,
    public readonly overtimeHours: OvertimeHours,
    public readonly nightHours: NightHours,
    public readonly holidayHours: HolidayHours,
    public readonly approvedAbsenceHours: ApprovedAbsenceHours,
    public readonly unapprovedAbsenceHours: UnapprovedAbsenceHours
  ) {
    super(id);
  }

  public static create(
    staffId: StaffId,
    workedHours: WorkedHours,
    regularHours: RegularHours,
    overtimeHours: OvertimeHours,
    nightHours: NightHours,
    holidayHours: HolidayHours,
    approvedAbsenceHours: ApprovedAbsenceHours,
    unapprovedAbsenceHours: UnapprovedAbsenceHours
  ): PayrollAttendanceSummary {
    return new PayrollAttendanceSummary(
      PayrollAttendanceSummaryId.generate(),
      staffId,
      workedHours,
      regularHours,
      overtimeHours,
      nightHours,
      holidayHours,
      approvedAbsenceHours,
      unapprovedAbsenceHours
    );
  }
}
