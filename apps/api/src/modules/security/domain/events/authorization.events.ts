import {
  RoleId,
  PermissionId,
  PolicyId,
  UserId,
  ResourceId,
} from '../value-objects';
import { AuthorizationDecision } from '../enums/authorization.enums';

export class RoleCreated {
  constructor(
    public readonly roleId: RoleId,
    public readonly name: string,
    public readonly timestamp: Date,
  ) {}
}

export class RoleUpdated {
  constructor(
    public readonly roleId: RoleId,
    public readonly timestamp: Date,
  ) {}
}

export class RoleDeleted {
  constructor(
    public readonly roleId: RoleId,
    public readonly timestamp: Date,
  ) {}
}

export class PermissionGranted {
  constructor(
    public readonly permissionId: PermissionId,
    public readonly roleId: RoleId,
    public readonly timestamp: Date,
  ) {}
}

export class PermissionRevoked {
  constructor(
    public readonly permissionId: PermissionId,
    public readonly roleId: RoleId,
    public readonly timestamp: Date,
  ) {}
}

export class PolicyCreated {
  constructor(
    public readonly policyId: PolicyId,
    public readonly timestamp: Date,
  ) {}
}

export class PolicyUpdated {
  constructor(
    public readonly policyId: PolicyId,
    public readonly timestamp: Date,
  ) {}
}

export class AuthorizationEvaluated {
  constructor(
    public readonly userId: UserId,
    public readonly resourceId: ResourceId,
    public readonly action: string,
    public readonly decision: AuthorizationDecision,
    public readonly timestamp: Date,
  ) {}
}

export class AccessDenied {
  constructor(
    public readonly userId: UserId,
    public readonly resourceId: ResourceId,
    public readonly action: string,
    public readonly reason: string,
    public readonly timestamp: Date,
  ) {}
}
