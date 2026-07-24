import { Entity, Identifier } from '@saas/domain';
import { StaffId } from '../value-objects/staff-id';

export class ScheduleAssignmentId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ScheduleAssignmentId { return new ScheduleAssignmentId(value); }
  public static generate(): ScheduleAssignmentId { return new ScheduleAssignmentId(crypto.randomUUID()); }
}

export class ScheduleAssignment extends Entity<ScheduleAssignmentId> {
  constructor(
    id: ScheduleAssignmentId,
    public readonly staffId: StaffId,
    public readonly assignedAt: Date
  ) {
    super(id);
  }

  public static create(staffId: StaffId): ScheduleAssignment {
    return new ScheduleAssignment(ScheduleAssignmentId.generate(), staffId, new Date());
  }
}
