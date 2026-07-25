import {
  RoleId,
  RoleName,
  PermissionId,
  PermissionName,
  PolicyId,
  PolicyCondition,
  ResourceType,
  Action,
} from '../value-objects';
import { PermissionScope } from '../enums/authorization.enums';

export class Permission {
  constructor(
    public readonly id: PermissionId,
    public readonly name: PermissionName,
    public readonly resourceType: ResourceType,
    public readonly action: Action,
    public readonly scope: PermissionScope,
    public readonly description?: string,
  ) {}
}

export class Role {
  private _permissions: Set<string>;

  constructor(
    public readonly id: RoleId,
    public name: RoleName,
    public readonly tenantId?: string,
    public description?: string,
    public parentRoleId?: RoleId,
    permissions: PermissionId[] = [],
  ) {
    this._permissions = new Set(permissions.map(p => p.value));
  }

  public grantPermission(permissionId: PermissionId): void {
    this._permissions.add(permissionId.value);
  }

  public revokePermission(permissionId: PermissionId): void {
    this._permissions.delete(permissionId.value);
  }

  public hasPermission(permissionId: PermissionId): boolean {
    return this._permissions.has(permissionId.value);
  }

  get permissions(): ReadonlyArray<PermissionId> {
    return Array.from(this._permissions).map(v => new PermissionId(v));
  }
}

export class Policy {
  constructor(
    public readonly id: PolicyId,
    public name: string,
    public readonly targetResourceType: ResourceType,
    public readonly conditions: PolicyCondition[],
    public readonly effect: 'Allow' | 'Deny',
    public isActive: boolean = true,
  ) {}

  public addCondition(condition: PolicyCondition): void {
    this.conditions.push(condition);
  }
}
