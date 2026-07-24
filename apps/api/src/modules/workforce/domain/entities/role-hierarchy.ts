import { Entity, Identifier } from '@saas/domain';
import { RoleId } from '../aggregates/role';

export class RoleHierarchyId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): RoleHierarchyId { return new RoleHierarchyId(value); }
  public static generate(): RoleHierarchyId { return new RoleHierarchyId(crypto.randomUUID()); }
}

export class RoleHierarchy extends Entity<RoleHierarchyId> {
  constructor(
    id: RoleHierarchyId,
    public readonly parentRoleId: RoleId,
    public readonly childRoleId: RoleId,
    public readonly linkedAt: Date
  ) {
    super(id);
  }

  public static create(parentRoleId: RoleId, childRoleId: RoleId): RoleHierarchy {
    if (parentRoleId.toValue() === childRoleId.toValue()) {
      throw new Error('A role cannot inherit from itself.');
    }
    return new RoleHierarchy(RoleHierarchyId.generate(), parentRoleId, childRoleId, new Date());
  }
}
