import { Entity, Identifier } from '@saas/domain';
import { PermissionCode } from '../value-objects/permission-code';
import { PermissionScope } from '../value-objects/permission-scope';

export class PermissionId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PermissionId { return new PermissionId(value); }
  public static generate(): PermissionId { return new PermissionId(crypto.randomUUID()); }
}

export class Permission extends Entity<PermissionId> {
  constructor(
    id: PermissionId,
    public readonly code: PermissionCode,
    public readonly scope: PermissionScope,
    public readonly grantedAt: Date
  ) {
    super(id);
  }

  public static create(code: PermissionCode, scope: PermissionScope): Permission {
    return new Permission(PermissionId.generate(), code, scope, new Date());
  }

  public equals(other: Permission): boolean {
    return this.code.toValue() === other.code.toValue() && this.scope.toValue() === other.scope.toValue();
  }
}
