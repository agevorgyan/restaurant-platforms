import { PermissionScope } from '../../domain/enums/authorization.enums';

export class CreateRoleDto {
  name!: string;
  description?: string;
  tenantId?: string;
  parentRoleId?: string;
  permissionIds?: string[];
}

export class UpdateRoleDto {
  name?: string;
  description?: string;
  permissionIds?: string[];
}

export class CreatePolicyDto {
  name!: string;
  targetResourceType!: string;
  conditions!: any[];
  effect!: 'Allow' | 'Deny';
}

export class AuthorizeRequestDto {
  userId!: string;
  resourceId!: string;
  resourceType!: string;
  action!: string;
  context?: Record<string, any>;
}
