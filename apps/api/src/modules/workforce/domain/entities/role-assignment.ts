import { Entity, Identifier } from '@saas/domain';
import { StaffId } from '../value-objects/staff-id';

export class RoleAssignmentId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): RoleAssignmentId { return new RoleAssignmentId(value); }
  public static generate(): RoleAssignmentId { return new RoleAssignmentId(crypto.randomUUID()); }
}

export class RoleAssignment extends Entity<RoleAssignmentId> {
  constructor(
    id: RoleAssignmentId,
    public readonly staffId: StaffId,
    public readonly assignedAt: Date
  ) {
    super(id);
  }

  public static create(staffId: StaffId): RoleAssignment {
    return new RoleAssignment(RoleAssignmentId.generate(), staffId, new Date());
  }
}
