import { Entity, Identifier } from '@saas/domain';
import { StaffId } from '../value-objects/staff-id';

export class AssignedEmployeeId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AssignedEmployeeId { return new AssignedEmployeeId(value); }
  public static generate(): AssignedEmployeeId { return new AssignedEmployeeId(crypto.randomUUID()); }
}

export class AssignedEmployee extends Entity<AssignedEmployeeId> {
  constructor(
    id: AssignedEmployeeId,
    public readonly staffId: StaffId,
    public readonly assignedAt: Date
  ) {
    super(id);
  }

  public static create(staffId: StaffId): AssignedEmployee {
    return new AssignedEmployee(AssignedEmployeeId.generate(), staffId, new Date());
  }
}
