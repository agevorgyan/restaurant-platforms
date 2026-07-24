import { Entity, Identifier } from '@saas/domain';
import { StaffId } from '../value-objects/staff-id';

export class PayrollShiftSummaryId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PayrollShiftSummaryId { return new PayrollShiftSummaryId(value); }
  public static generate(): PayrollShiftSummaryId { return new PayrollShiftSummaryId(crypto.randomUUID()); }
}

export class PayrollShiftSummary extends Entity<PayrollShiftSummaryId> {
  constructor(
    id: PayrollShiftSummaryId,
    public readonly staffId: StaffId,
    public readonly totalShiftsAssigned: number,
    public readonly totalShiftsCompleted: number,
    public readonly totalShiftsMissed: number
  ) {
    super(id);
  }

  public static create(
    staffId: StaffId,
    totalShiftsAssigned: number,
    totalShiftsCompleted: number,
    totalShiftsMissed: number
  ): PayrollShiftSummary {
    return new PayrollShiftSummary(
      PayrollShiftSummaryId.generate(),
      staffId,
      totalShiftsAssigned,
      totalShiftsCompleted,
      totalShiftsMissed
    );
  }
}
