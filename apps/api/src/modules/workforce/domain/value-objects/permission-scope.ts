import { DomainPrimitive } from '@saas/domain';

export enum PermissionScopeEnum {
  GLOBAL = 'GLOBAL',
  STORE = 'STORE',
  DEPARTMENT = 'DEPARTMENT',
  SELF = 'SELF'
}

export class PermissionScope extends DomainPrimitive<PermissionScopeEnum> {
  private constructor(value: PermissionScopeEnum) {
    super(value);
  }

  public static create(value: PermissionScopeEnum): PermissionScope {
    if (!Object.values(PermissionScopeEnum).includes(value)) {
      throw new Error(`Invalid permission scope: ${value}`);
    }
    return new PermissionScope(value);
  }
}
