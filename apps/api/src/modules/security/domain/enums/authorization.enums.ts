export enum AuthorizationDecision {
  Allow = 'Allow',
  Deny = 'Deny',
  Conditional = 'Conditional',
}

export enum PermissionScope {
  Global = 'Global',
  Tenant = 'Tenant',
  Organization = 'Organization',
  Branch = 'Branch',
  Department = 'Department',
  User = 'User',
  Resource = 'Resource',
}
