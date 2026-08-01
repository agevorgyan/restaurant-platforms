/**
 * Enterprise Platform Health & Operations Platform - Domain Exceptions
 *
 * Strongly-typed domain exceptions thrown by health aggregates, value objects, and domain services
 * when invariant violations occur.
 */

export class InvalidDependencyGraphException extends Error {
  constructor(message: string) {
    super(`[InvalidDependencyGraphException] ${message}`);
    this.name = 'InvalidDependencyGraphException';
  }
}

export class InvalidMaintenanceWindowException extends Error {
  constructor(message: string) {
    super(`[InvalidMaintenanceWindowException] ${message}`);
    this.name = 'InvalidMaintenanceWindowException';
  }
}

export class ServiceNotFoundException extends Error {
  constructor(id: string) {
    super(`[ServiceNotFoundException] Service with ID or name '${id}' was not found.`);
    this.name = 'ServiceNotFoundException';
  }
}

export class HeartbeatTimeoutException extends Error {
  constructor(serviceId: string, lastSeenMs: number) {
    super(`[HeartbeatTimeoutException] Service '${serviceId}' missed heartbeat (last seen ${lastSeenMs}ms ago).`);
    this.name = 'HeartbeatTimeoutException';
  }
}

export class UnauthorizedPlatformAccessException extends Error {
  constructor(tenantId: string, resourceId: string) {
    super(`[UnauthorizedPlatformAccessException] Tenant '${tenantId}' does not have access to platform resource '${resourceId}'.`);
    this.name = 'UnauthorizedPlatformAccessException';
  }
}
