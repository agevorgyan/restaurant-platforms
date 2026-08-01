/**
 * Enterprise Tenant Provisioning Platform - Domain Exceptions
 *
 * Strongly-typed domain exceptions thrown by provisioning aggregates, value objects, and domain services
 * when invariant violations or step failures occur.
 */

export class InvalidProvisioningPlanException extends Error {
  constructor(message: string) {
    super(`[InvalidProvisioningPlanException] ${message}`);
    this.name = 'InvalidProvisioningPlanException';
  }
}

export class ProvisioningStepFailedException extends Error {
  constructor(stepName: string, reason: string) {
    super(`[ProvisioningStepFailedException] Provisioning step '${stepName}' failed: ${reason}`);
    this.name = 'ProvisioningStepFailedException';
  }
}

export class TenantAlreadyExistsException extends Error {
  constructor(slugOrId: string) {
    super(`[TenantAlreadyExistsException] Tenant with ID or slug '${slugOrId}' already exists.`);
    this.name = 'TenantAlreadyExistsException';
  }
}

export class TenantNotFoundException extends Error {
  constructor(id: string) {
    super(`[TenantNotFoundException] Tenant with ID '${id}' was not found.`);
    this.name = 'TenantNotFoundException';
  }
}

export class PartialInitializationException extends Error {
  constructor(tenantId: string, failedSteps: string[]) {
    super(`[PartialInitializationException] Tenant '${tenantId}' left in partial state after steps failed: ${failedSteps.join(', ')}`);
    this.name = 'PartialInitializationException';
  }
}

export class UnauthorizedProvisioningAccessException extends Error {
  constructor(tenantId: string, resourceId: string) {
    super(`[UnauthorizedProvisioningAccessException] Tenant '${tenantId}' does not have permission for resource '${resourceId}'.`);
    this.name = 'UnauthorizedProvisioningAccessException';
  }
}
