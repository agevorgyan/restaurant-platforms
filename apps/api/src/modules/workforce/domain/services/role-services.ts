import { IDomainService } from '@saas/domain';
import { Permission } from '../entities/permission';

export class PermissionEvaluationService implements IDomainService {
  public evaluate(assignedPermissions: Permission[], requiredPermissionCode: string, scope: string): boolean {
    return assignedPermissions.some(
      p => p.code.toValue() === requiredPermissionCode && 
           (p.scope.toValue() === 'GLOBAL' || p.scope.toValue() === scope)
    );
  }
}

export class RoleHierarchyService implements IDomainService {
  public resolveAllPermissions(rolePermissions: Permission[], descendantPermissions: Permission[]): Permission[] {
    const all = [...rolePermissions];
    for (const dp of descendantPermissions) {
      if (!all.some(p => p.equals(dp))) {
        all.push(dp);
      }
    }
    return all;
  }
}

export class RoleAssignmentService implements IDomainService {
  public canAssign(roleStatus: string): boolean {
    return roleStatus === 'ACTIVE';
  }
}
