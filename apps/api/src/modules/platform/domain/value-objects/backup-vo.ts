/**
 * Enterprise Backup & Disaster Recovery Platform - Value Objects
 *
 * Immutable Value Objects encapsulating backup identity, policies, schedules, snapshot IDs,
 * recovery points, RPO/RTO objectives, restore requests, restore plans, replication policies, and validation results.
 */

import { createHash } from 'crypto';
import { BackupType, RecoveryType } from '../enums/backup.enums';
import { InvalidBackupPolicyException, RPORTOViolationException } from '../exceptions/backup.exceptions';

/**
 * BackupId Value Object
 */
export class BackupId {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('BackupId cannot be empty');
    }
    this.value = value;
  }

  public static create(id?: string): BackupId {
    return new BackupId(id || `bkp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
  }

  public static fromString(id: string): BackupId {
    return new BackupId(id);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: BackupId): boolean {
    return this.value === other.getValue();
  }
}

/**
 * SnapshotId Value Object
 */
export class SnapshotId {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('SnapshotId cannot be empty');
    }
    this.value = value;
  }

  public static create(id?: string): SnapshotId {
    return new SnapshotId(id || `snp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }

  public getValue(): string {
    return this.value;
  }
}

/**
 * BackupPolicy Value Object
 */
export class BackupPolicy {
  public readonly policyId: string;
  public readonly retentionDays: number;
  public readonly encryptionKeyId: string;
  public readonly frequencyMinutes: number;

  private constructor(policyId: string, retentionDays: number = 30, encryptionKeyId?: string, frequencyMinutes: number = 1440) {
    if (retentionDays <= 0) {
      throw new InvalidBackupPolicyException('Retention days must be greater than zero.');
    }
    this.policyId = policyId;
    this.retentionDays = retentionDays;
    this.encryptionKeyId = encryptionKeyId || 'kms-key-default-aes256';
    this.frequencyMinutes = frequencyMinutes;
  }

  public static create(props: {
    policyId?: string;
    retentionDays?: number;
    encryptionKeyId?: string;
    frequencyMinutes?: number;
  }): BackupPolicy {
    const id = props.policyId || `pol-${Date.now()}`;
    return new BackupPolicy(id, props.retentionDays, props.encryptionKeyId, props.frequencyMinutes);
  }

  public static defaultPolicy(): BackupPolicy {
    return new BackupPolicy('policy-daily-30d', 30, 'kms-key-default-aes256', 1440);
  }
}

/**
 * BackupSchedule Value Object
 */
export class BackupSchedule {
  public readonly cronExpression: string;
  public readonly nextRunAt: Date;
  public readonly isActive: boolean;

  private constructor(cronExpression: string, nextRunAt?: Date, isActive: boolean = true) {
    this.cronExpression = cronExpression;
    this.nextRunAt = nextRunAt || new Date(Date.now() + 24 * 60 * 60 * 1000);
    this.isActive = isActive;
  }

  public static create(cronExpression: string, nextRunAt?: Date, isActive: boolean = true): BackupSchedule {
    return new BackupSchedule(cronExpression, nextRunAt, isActive);
  }

  public static daily(): BackupSchedule {
    return new BackupSchedule('0 0 * * *');
  }
}

/**
 * RecoveryPoint Value Object
 */
export class RecoveryPoint {
  public readonly timestamp: Date;
  public readonly sequenceNumber: number;
  public readonly checksum: string;

  private constructor(timestamp: Date, sequenceNumber: number, checksum: string) {
    this.timestamp = timestamp;
    this.sequenceNumber = sequenceNumber;
    this.checksum = checksum;
  }

  public static create(timestamp: Date, sequenceNumber: number, dataPayload?: unknown): RecoveryPoint {
    const jsonStr = typeof dataPayload === 'string' ? dataPayload : JSON.stringify(dataPayload || {});
    const checksum = createHash('sha256').update(jsonStr).digest('hex');
    return new RecoveryPoint(timestamp, sequenceNumber, checksum);
  }
}

/**
 * RecoveryObjective Value Object (RPO & RTO Objectives)
 */
export class RecoveryObjective {
  public readonly rpoMinutes: number; // Recovery Point Objective (e.g. max 5 min data loss)
  public readonly rtoMinutes: number; // Recovery Time Objective (e.g. max 15 min downtime)
  public readonly meetsObjectives: boolean;

  private constructor(rpoMinutes: number = 5, rtoMinutes: number = 15, actualRpo?: number, actualRto?: number) {
    this.rpoMinutes = rpoMinutes;
    this.rtoMinutes = rtoMinutes;

    if (actualRpo !== undefined && actualRpo > rpoMinutes) {
      throw new RPORTOViolationException('RPO', actualRpo, rpoMinutes);
    }
    if (actualRto !== undefined && actualRto > rtoMinutes) {
      throw new RPORTOViolationException('RTO', actualRto, rtoMinutes);
    }

    this.meetsObjectives = (actualRpo === undefined || actualRpo <= rpoMinutes) && (actualRto === undefined || actualRto <= rtoMinutes);
  }

  public static create(props: {
    rpoMinutes?: number;
    rtoMinutes?: number;
    actualRpoMinutes?: number;
    actualRtoMinutes?: number;
  }): RecoveryObjective {
    return new RecoveryObjective(
      props.rpoMinutes,
      props.rtoMinutes,
      props.actualRpoMinutes,
      props.actualRtoMinutes
    );
  }

  public static standardEnterprise(): RecoveryObjective {
    return new RecoveryObjective(5, 15);
  }
}

/**
 * RestoreRequest Value Object
 */
export class RestoreRequest {
  public readonly requestId: string;
  public readonly recoveryType: RecoveryType;
  public readonly targetEnvironment: string;
  public readonly targetTimestamp?: Date;

  private constructor(props: {
    requestId?: string;
    recoveryType: RecoveryType;
    targetEnvironment: string;
    targetTimestamp?: Date;
  }) {
    this.requestId = props.requestId || `rst-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    this.recoveryType = props.recoveryType;
    this.targetEnvironment = props.targetEnvironment;
    this.targetTimestamp = props.targetTimestamp;
  }

  public static create(props: {
    requestId?: string;
    recoveryType: RecoveryType;
    targetEnvironment: string;
    targetTimestamp?: Date;
  }): RestoreRequest {
    return new RestoreRequest(props);
  }
}

/**
 * RestorePlan Value Object
 */
export class RestorePlan {
  public readonly steps: string[];
  public readonly targetRegion: string;
  public readonly timeoutMs: number;

  private constructor(steps: string[], targetRegion: string = 'us-west-2', timeoutMs: number = 60000) {
    this.steps = steps;
    this.targetRegion = targetRegion;
    this.timeoutMs = timeoutMs;
  }

  public static create(steps: string[], targetRegion?: string, timeoutMs?: number): RestorePlan {
    return new RestorePlan(steps, targetRegion, timeoutMs);
  }

  public static standardSagaRestorePlan(): RestorePlan {
    return new RestorePlan([
      'INITIATE',
      'RESERVE_TARGET',
      'APPLY_SNAPSHOT',
      'PLAY_PITR_LOGS',
      'VALIDATE_INTEGRATION',
      'MARK_VALIDATED',
    ]);
  }
}

/**
 * ReplicationPolicy Value Object (Cross-Region Async Replication)
 */
export class ReplicationPolicy {
  public readonly sourceRegion: string;
  public readonly destinationRegion: string;
  public readonly syncIntervalSec: number;
  public readonly isCrossRegion: boolean;

  private constructor(sourceRegion: string, destinationRegion: string, syncIntervalSec: number = 60) {
    this.sourceRegion = sourceRegion;
    this.destinationRegion = destinationRegion;
    this.syncIntervalSec = syncIntervalSec;
    this.isCrossRegion = sourceRegion !== destinationRegion;
  }

  public static create(sourceRegion: string, destinationRegion: string, syncIntervalSec?: number): ReplicationPolicy {
    return new ReplicationPolicy(sourceRegion, destinationRegion, syncIntervalSec);
  }

  public static crossRegionDefault(): ReplicationPolicy {
    return new ReplicationPolicy('us-east-1', 'us-west-2', 60);
  }
}

/**
 * RecoveryValidation Value Object
 */
export class RecoveryValidation {
  public readonly isValid: boolean;
  public readonly dataConsistencyScore: number; // 0.0 to 100.0
  public readonly validationCheckResult: string;
  public readonly validatedAt: Date;

  private constructor(isValid: boolean, dataConsistencyScore: number, validationCheckResult: string) {
    this.isValid = isValid;
    this.dataConsistencyScore = dataConsistencyScore;
    this.validationCheckResult = validationCheckResult;
    this.validatedAt = new Date();
  }

  public static create(props: {
    isValid: boolean;
    dataConsistencyScore: number;
    validationCheckResult: string;
  }): RecoveryValidation {
    return new RecoveryValidation(props.isValid, props.dataConsistencyScore, props.validationCheckResult);
  }

  public static perfectScore(): RecoveryValidation {
    return new RecoveryValidation(true, 100.0, 'Data integrity verified. Zero checksum drift.');
  }
}
