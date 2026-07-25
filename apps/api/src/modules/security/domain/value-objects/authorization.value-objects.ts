export class AuthorizationId {
  constructor(public readonly value: string) {}
}

export class RoleId {
  constructor(public readonly value: string) {}
}

export class RoleName {
  constructor(public readonly value: string) {}
}

export class PermissionId {
  constructor(public readonly value: string) {}
}

export class PermissionName {
  constructor(public readonly value: string) {}
}

export class ResourceId {
  constructor(public readonly value: string) {}
}

export class ResourceType {
  constructor(public readonly value: string) {}
}

export class Action {
  constructor(public readonly value: string) {}
}

export class PolicyId {
  constructor(public readonly value: string) {}
}

export class PolicyCondition {
  constructor(
    public readonly attribute: string,
    public readonly operator: string,
    public readonly value: any,
  ) {}
}

export class SubjectAttribute {
  constructor(
    public readonly key: string,
    public readonly value: any,
  ) {}
}

export class ResourceAttribute {
  constructor(
    public readonly key: string,
    public readonly value: any,
  ) {}
}

export class EnvironmentAttribute {
  constructor(
    public readonly key: string,
    public readonly value: any,
  ) {}
}
