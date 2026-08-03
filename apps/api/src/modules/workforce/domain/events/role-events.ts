import { DomainEvent } from '@saas/events';
import { EventMetadata, createEventMetadata } from '@saas/events';

export class RoleCreated extends DomainEvent<{ roleId: string, roleCode: string, roleName: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { roleId: string, roleCode: string, roleName: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'RoleCreated', aggregateId, 'Role', aggregateVersion, new Date(), payload, metadata);
  }
}

export class RoleUpdated extends DomainEvent<{ roleId: string, roleName?: string, roleDescription?: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { roleId: string, roleName?: string, roleDescription?: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'RoleUpdated', aggregateId, 'Role', aggregateVersion, new Date(), payload, metadata);
  }
}

export class RoleActivated extends DomainEvent<{ roleId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { roleId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'RoleActivated', aggregateId, 'Role', aggregateVersion, new Date(), payload, metadata);
  }
}

export class RoleDeactivated extends DomainEvent<{ roleId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { roleId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'RoleDeactivated', aggregateId, 'Role', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PermissionAssigned extends DomainEvent<{ roleId: string, permissionCode: string, permissionScope: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { roleId: string, permissionCode: string, permissionScope: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'PermissionAssigned', aggregateId, 'Role', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PermissionRemoved extends DomainEvent<{ roleId: string, permissionCode: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { roleId: string, permissionCode: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'PermissionRemoved', aggregateId, 'Role', aggregateVersion, new Date(), payload, metadata);
  }
}

export class RoleAssignedToStaff extends DomainEvent<{ roleId: string, staffId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { roleId: string, staffId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'RoleAssignedToStaff', aggregateId, 'Role', aggregateVersion, new Date(), payload, metadata);
  }
}

export class RoleRemovedFromStaff extends DomainEvent<{ roleId: string, staffId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { roleId: string, staffId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'RoleRemovedFromStaff', aggregateId, 'Role', aggregateVersion, new Date(), payload, metadata);
  }
}
