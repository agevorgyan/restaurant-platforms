import { Specification } from '@saas/domain-rules';

export interface RoleActiveContext {
  status: string;
}

export class RoleActiveSpecification extends Specification<RoleActiveContext> {
  public isSatisfiedBy(candidate: RoleActiveContext): boolean {
    return candidate.status === 'ACTIVE';
  }
}

export interface UniquePermissionContext {
  existingPermissions: string[];
  newPermission: string;
}

export class UniquePermissionSpecification extends Specification<UniquePermissionContext> {
  public isSatisfiedBy(candidate: UniquePermissionContext): boolean {
    return !candidate.existingPermissions.includes(candidate.newPermission);
  }
}

export interface RoleHierarchyContext {
  parentRoleId: string;
  childRoleId: string;
  allDescendants: string[]; // Simplification for context
}

export class RoleHierarchySpecification extends Specification<RoleHierarchyContext> {
  public isSatisfiedBy(candidate: RoleHierarchyContext): boolean {
    // Cannot inherit from itself
    if (candidate.parentRoleId === candidate.childRoleId) {
      return false;
    }
    // Cannot create circular dependency (parent is not already a descendant of child)
    // Note: robust circular check needs the full graph, but here we expect descendants to be pre-resolved
    if (candidate.allDescendants.includes(candidate.parentRoleId)) {
      return false;
    }
    return true;
  }
}

export interface PermissionScopeContext {
  requestedScope: string;
  allowedScopes: string[];
}

export class PermissionScopeSpecification extends Specification<PermissionScopeContext> {
  public isSatisfiedBy(candidate: PermissionScopeContext): boolean {
    return candidate.allowedScopes.includes(candidate.requestedScope);
  }
}
