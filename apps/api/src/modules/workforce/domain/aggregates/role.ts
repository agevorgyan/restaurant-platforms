import { AggregateRoot, Identifier } from '@saas/domain';
import { RoleCode } from '../value-objects/role-code';
import { RoleName } from '../value-objects/role-name';
import { RoleDescription } from '../value-objects/role-description';
import { RoleStatus, RoleStatusEnum } from '../value-objects/role-status';
import { PermissionCode } from '../value-objects/permission-code';
import { PermissionScope } from '../value-objects/permission-scope';
import { StaffId } from '../value-objects/staff-id';
import { Permission } from '../entities/permission';
import { RoleAssignment } from '../entities/role-assignment';
import { RoleCreated, RoleUpdated, RoleActivated, RoleDeactivated, PermissionAssigned, PermissionRemoved, RoleAssignedToStaff, RoleRemovedFromStaff } from '../events/role-events';

export class RoleId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): RoleId { return new RoleId(value); }
  public static generate(): RoleId { return new RoleId(crypto.randomUUID()); }
}

export class Role extends AggregateRoot<RoleId> {
  private _status: RoleStatus;
  private _permissions: Permission[] = [];
  private _assignments: RoleAssignment[] = [];

  constructor(
    id: RoleId,
    public readonly code: RoleCode,
    public readonly name: RoleName,
    public readonly description: RoleDescription,
    status: RoleStatus = RoleStatus.create(RoleStatusEnum.ACTIVE)
  ) {
    super(id);
    this._status = status;
  }

  public static create(code: RoleCode, name: RoleName, description: RoleDescription): Role {
    const id = RoleId.generate();
    const role = new Role(id, code, name, description, RoleStatus.create(RoleStatusEnum.ACTIVE));

    role.record(new RoleCreated(id.toValue(), role.version(), {
      roleId: id.toValue(),
      roleCode: code.toValue(),
      roleName: name.toValue()
    }));

    return role;
  }

  get status(): RoleStatus { return this._status; }
  get permissions(): Permission[] { return [...this._permissions]; }
  get assignments(): RoleAssignment[] { return [...this._assignments]; }

  public update(name?: RoleName, description?: RoleDescription): void {
    this.record(new RoleUpdated(this.id.toValue(), this.version(), {
      roleId: this.id.toValue(),
      roleName: name?.toValue(),
      roleDescription: description?.toValue()
    }));
  }

  public activate(): void {
    if (this._status.toValue() === RoleStatusEnum.ACTIVE) {
      throw new Error('Role is already active.');
    }
    this._status = RoleStatus.create(RoleStatusEnum.ACTIVE);
    this.record(new RoleActivated(this.id.toValue(), this.version(), { roleId: this.id.toValue() }));
  }

  public deactivate(): void {
    if (this._status.toValue() === RoleStatusEnum.INACTIVE) {
      throw new Error('Role is already inactive.');
    }
    this._status = RoleStatus.create(RoleStatusEnum.INACTIVE);
    this.record(new RoleDeactivated(this.id.toValue(), this.version(), { roleId: this.id.toValue() }));
  }

  public assignPermission(code: PermissionCode, scope: PermissionScope): void {
    const exists = this._permissions.some(p => p.code.toValue() === code.toValue() && p.scope.toValue() === scope.toValue());
    if (exists) {
      throw new Error('Permission cannot be duplicated.');
    }
    const permission = Permission.create(code, scope);
    this._permissions.push(permission);

    this.record(new PermissionAssigned(this.id.toValue(), this.version(), {
      roleId: this.id.toValue(),
      permissionCode: code.toValue(),
      permissionScope: scope.toValue()
    }));
  }

  public removePermission(code: PermissionCode): void {
    const initialLength = this._permissions.length;
    this._permissions = this._permissions.filter(p => p.code.toValue() !== code.toValue());
    if (this._permissions.length === initialLength) {
      throw new Error('Permission not found.');
    }

    this.record(new PermissionRemoved(this.id.toValue(), this.version(), {
      roleId: this.id.toValue(),
      permissionCode: code.toValue()
    }));
  }

  public assignToStaff(staffId: StaffId): void {
    if (this._status.toValue() === RoleStatusEnum.INACTIVE) {
      throw new Error('Inactive roles cannot be assigned.');
    }
    const exists = this._assignments.some(a => a.staffId.toValue() === staffId.toValue());
    if (exists) {
      throw new Error('Role is already assigned to this staff member.');
    }
    
    this._assignments.push(RoleAssignment.create(staffId));

    this.record(new RoleAssignedToStaff(this.id.toValue(), this.version(), {
      roleId: this.id.toValue(),
      staffId: staffId.toValue()
    }));
  }

  public removeFromStaff(staffId: StaffId): void {
    const initialLength = this._assignments.length;
    this._assignments = this._assignments.filter(a => a.staffId.toValue() !== staffId.toValue());
    if (this._assignments.length === initialLength) {
      throw new Error('Role assignment not found.');
    }

    this.record(new RoleRemovedFromStaff(this.id.toValue(), this.version(), {
      roleId: this.id.toValue(),
      staffId: staffId.toValue()
    }));
  }
}
