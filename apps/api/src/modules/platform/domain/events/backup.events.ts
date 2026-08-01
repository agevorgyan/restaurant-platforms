/**
 * Enterprise Backup & Disaster Recovery Platform - Domain Events
 *
 * Emitted by BackupAggregate and RestoreSagaAggregate roots upon backup scheduling,
 * snapshot creation, restore saga initiation, validation checks, and disaster recovery failover triggers.
 */

import { randomUUID } from 'crypto';
import { BasePlatformDomainEvent } from './health.events';
import { BackupStatus, BackupType, RecoveryType, RestoreStatus } from '../enums/backup.enums';

export class BackupScheduledEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'BackupScheduled';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly backupType: BackupType,
    public readonly scheduledTime: Date,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class BackupStartedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'BackupStarted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly backupType: BackupType,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class BackupCompletedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'BackupCompleted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly backupType: BackupType,
    public readonly sizeBytes: number,
    public readonly checksum: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class SnapshotCreatedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'SnapshotCreated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly snapshotId: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class RestoreStartedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'RestoreStarted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly recoveryType: RecoveryType,
    public readonly targetEnvironment: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class RestoreCompletedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'RestoreCompleted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly recoveryType: RecoveryType,
    public readonly durationMs: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class RecoveryValidatedEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'RecoveryValidated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly score: number,
    public readonly meetsObjectives: boolean,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class DisasterRecoveryTriggeredEvent implements BasePlatformDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'DisasterRecoveryTriggered';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly sourceRegion: string,
    public readonly destinationRegion: string,
    public readonly reason: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export type BackupDomainEvent =
  | BackupScheduledEvent
  | BackupStartedEvent
  | BackupCompletedEvent
  | SnapshotCreatedEvent
  | RestoreStartedEvent
  | RestoreCompletedEvent
  | RecoveryValidatedEvent
  | DisasterRecoveryTriggeredEvent;
