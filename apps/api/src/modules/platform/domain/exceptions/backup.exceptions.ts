/**
 * Enterprise Backup & Disaster Recovery Platform - Domain Exceptions
 *
 * Strongly-typed domain exceptions thrown by backup aggregates, value objects, and domain services
 * when invariant violations or RPO/RTO validation failures occur.
 */

export class InvalidBackupPolicyException extends Error {
  constructor(message: string) {
    super(`[InvalidBackupPolicyException] ${message}`);
    this.name = 'InvalidBackupPolicyException';
  }
}

export class ImmutableBackupException extends Error {
  constructor(backupId: string) {
    super(`[ImmutableBackupException] Backup '${backupId}' is completed and immutable. Cannot overwrite completed backup metadata.`);
    this.name = 'ImmutableBackupException';
  }
}

export class BackupNotFoundException extends Error {
  constructor(id: string) {
    super(`[BackupNotFoundException] Backup with ID '${id}' was not found.`);
    this.name = 'BackupNotFoundException';
  }
}

export class RestoreValidationFailedException extends Error {
  constructor(restoreId: string, reason: string) {
    super(`[RestoreValidationFailedException] Restore operation '${restoreId}' failed post-restore data integrity validation: ${reason}`);
    this.name = 'RestoreValidationFailedException';
  }
}

export class RPORTOViolationException extends Error {
  constructor(metric: 'RPO' | 'RTO', actualMinutes: number, targetMinutes: number) {
    super(`[RPORTOViolationException] Recovery objective violation: Actual ${metric} (${actualMinutes} min) exceeded target (${targetMinutes} min).`);
    this.name = 'RPORTOViolationException';
  }
}

export class UnauthorizedBackupAccessException extends Error {
  constructor(tenantId: string, resourceId: string) {
    super(`[UnauthorizedBackupAccessException] Tenant '${tenantId}' does not have permission for backup resource '${resourceId}'.`);
    this.name = 'UnauthorizedBackupAccessException';
  }
}
