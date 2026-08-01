/**
 * Enterprise Backup & Disaster Recovery Platform - Domain Aggregate Roots
 *
 * Implements two domain aggregate roots:
 * 1. BackupAggregate (Immutable Backup Catalog Lifecycle: SCHEDULED -> RUNNING -> COMPLETED -> EXPIRED/ARCHIVED)
 * 2. RestoreSagaAggregate (Saga Orchestrated Disaster Recovery Workflow: PENDING -> RUNNING -> COMPLETED -> VALIDATED)
 */

import { BackupStatus, BackupType, RecoveryType, RestoreStatus } from '../enums/backup.enums';
import {
  BackupId,
  BackupPolicy,
  BackupSchedule,
  RecoveryObjective,
  RecoveryPoint,
  RecoveryValidation,
  ReplicationPolicy,
  RestorePlan,
  RestoreRequest,
  SnapshotId,
} from '../value-objects/backup-vo';
import { ImmutableBackupException } from '../exceptions/backup.exceptions';
import { BasePlatformDomainEvent } from '../events/health.events';
import {
  BackupCompletedEvent,
  BackupScheduledEvent,
  BackupStartedEvent,
  DisasterRecoveryTriggeredEvent,
  RecoveryValidatedEvent,
  RestoreCompletedEvent,
  RestoreStartedEvent,
  SnapshotCreatedEvent,
} from '../events/backup.events';

export interface CreateBackupProps {
  tenantId: string;
  backupType: BackupType;
  policy?: BackupPolicy;
  schedule?: BackupSchedule;
  createdBy?: string;
}

export class BackupAggregate {
  private readonly id: BackupId;
  private readonly tenantId: string;
  private readonly backupType: BackupType;
  private policy: BackupPolicy;
  private schedule: BackupSchedule;
  private snapshotId?: SnapshotId;
  private status: BackupStatus;
  private sizeBytes: number;
  private checksum: string;
  private isImmutable: boolean;
  private recoveryPoint?: RecoveryPoint;
  private createdBy: string;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private uncommittedEvents: BasePlatformDomainEvent[] = [];

  private constructor(props: {
    id: BackupId;
    tenantId: string;
    backupType: BackupType;
    policy: BackupPolicy;
    schedule: BackupSchedule;
    snapshotId?: SnapshotId;
    status: BackupStatus;
    sizeBytes?: number;
    checksum?: string;
    isImmutable?: boolean;
    recoveryPoint?: RecoveryPoint;
    createdBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.backupType = props.backupType;
    this.policy = props.policy;
    this.schedule = props.schedule;
    this.snapshotId = props.snapshotId;
    this.status = props.status;
    this.sizeBytes = props.sizeBytes ?? 0;
    this.checksum = props.checksum ?? '';
    this.isImmutable = props.isImmutable ?? false;
    this.recoveryPoint = props.recoveryPoint;
    this.createdBy = props.createdBy || 'system';
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  public static create(props: CreateBackupProps): BackupAggregate {
    const id = BackupId.create();
    const policy = props.policy || BackupPolicy.defaultPolicy();
    const schedule = props.schedule || BackupSchedule.daily();

    const aggregate = new BackupAggregate({
      id,
      tenantId: props.tenantId,
      backupType: props.backupType,
      policy,
      schedule,
      status: BackupStatus.SCHEDULED,
      createdBy: props.createdBy,
    });

    aggregate.addDomainEvent(
      new BackupScheduledEvent(
        id.getValue(),
        props.tenantId,
        props.backupType,
        schedule.nextRunAt
      )
    );

    return aggregate;
  }

  public static reconstitute(props: {
    id: BackupId;
    tenantId: string;
    backupType: BackupType;
    policy: BackupPolicy;
    schedule: BackupSchedule;
    snapshotId?: SnapshotId;
    status: BackupStatus;
    sizeBytes: number;
    checksum: string;
    isImmutable: boolean;
    recoveryPoint?: RecoveryPoint;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
  }): BackupAggregate {
    return new BackupAggregate(props);
  }

  // Getters
  public getId(): BackupId {
    return this.id;
  }

  public getTenantId(): string {
    return this.tenantId;
  }

  public getBackupType(): BackupType {
    return this.backupType;
  }

  public getPolicy(): BackupPolicy {
    return this.policy;
  }

  public getSchedule(): BackupSchedule {
    return this.schedule;
  }

  public getSnapshotId(): SnapshotId | undefined {
    return this.snapshotId;
  }

  public getStatus(): BackupStatus {
    return this.status;
  }

  public getSizeBytes(): number {
    return this.sizeBytes;
  }

  public getChecksum(): string {
    return this.checksum;
  }

  public getIsImmutable(): boolean {
    return this.isImmutable;
  }

  public getRecoveryPoint(): RecoveryPoint | undefined {
    return this.recoveryPoint;
  }

  public getCreatedBy(): string {
    return this.createdBy;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Lifecycle Mutations
  public startBackup(): void {
    if (this.isImmutable) {
      throw new ImmutableBackupException(this.id.getValue());
    }
    this.status = BackupStatus.RUNNING;
    this.updatedAt = new Date();

    this.addDomainEvent(
      new BackupStartedEvent(
        this.id.getValue(),
        this.tenantId,
        this.backupType
      )
    );
  }

  public completeBackup(sizeBytes: number, checksum: string, recoveryPoint: RecoveryPoint): void {
    if (this.isImmutable) {
      throw new ImmutableBackupException(this.id.getValue());
    }
    this.status = BackupStatus.COMPLETED;
    this.sizeBytes = sizeBytes;
    this.checksum = checksum;
    this.recoveryPoint = recoveryPoint;
    this.snapshotId = SnapshotId.create();
    this.isImmutable = true; // Lock backup immutability
    this.updatedAt = new Date();

    this.addDomainEvent(
      new BackupCompletedEvent(
        this.id.getValue(),
        this.tenantId,
        this.backupType,
        sizeBytes,
        checksum
      )
    );

    this.addDomainEvent(
      new SnapshotCreatedEvent(
        this.id.getValue(),
        this.tenantId,
        this.snapshotId.getValue()
      )
    );
  }

  public failBackup(reason: string): void {
    this.status = BackupStatus.FAILED;
    this.updatedAt = new Date();
  }

  private addDomainEvent(event: BasePlatformDomainEvent): void {
    this.uncommittedEvents.push(event);
  }

  public getUncommittedEvents(): BasePlatformDomainEvent[] {
    return [...this.uncommittedEvents];
  }

  public clearUncommittedEvents(): void {
    this.uncommittedEvents = [];
  }
}

/**
 * RestoreSagaAggregate Root
 * Manages disaster recovery & restore workflows via Saga orchestration.
 */
export class RestoreSagaAggregate {
  private readonly sagaId: string;
  private readonly tenantId: string;
  private readonly backupId: BackupId;
  private readonly recoveryType: RecoveryType;
  private status: RestoreStatus;
  private request: RestoreRequest;
  private plan: RestorePlan;
  private objectives: RecoveryObjective;
  private validation?: RecoveryValidation;
  private executedSteps: string[] = [];
  private durationMs: number = 0;
  private createdBy: string;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private uncommittedEvents: BasePlatformDomainEvent[] = [];

  private constructor(props: {
    sagaId: string;
    tenantId: string;
    backupId: BackupId;
    recoveryType: RecoveryType;
    status: RestoreStatus;
    request: RestoreRequest;
    plan: RestorePlan;
    objectives: RecoveryObjective;
    validation?: RecoveryValidation;
    executedSteps?: string[];
    durationMs?: number;
    createdBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.sagaId = props.sagaId;
    this.tenantId = props.tenantId;
    this.backupId = props.backupId;
    this.recoveryType = props.recoveryType;
    this.status = props.status;
    this.request = props.request;
    this.plan = props.plan;
    this.objectives = props.objectives;
    this.validation = props.validation;
    this.executedSteps = props.executedSteps || [];
    this.durationMs = props.durationMs ?? 0;
    this.createdBy = props.createdBy || 'system';
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  public static startRestoreSaga(props: {
    tenantId: string;
    backupId: BackupId;
    recoveryType: RecoveryType;
    targetEnvironment: string;
    objectives?: RecoveryObjective;
    createdBy?: string;
  }): RestoreSagaAggregate {
    const sagaId = `rst-saga-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const request = RestoreRequest.create({
      recoveryType: props.recoveryType,
      targetEnvironment: props.targetEnvironment,
    });
    const plan = RestorePlan.standardSagaRestorePlan();
    const objectives = props.objectives || RecoveryObjective.standardEnterprise();

    const aggregate = new RestoreSagaAggregate({
      sagaId,
      tenantId: props.tenantId,
      backupId: props.backupId,
      recoveryType: props.recoveryType,
      status: RestoreStatus.RUNNING,
      request,
      plan,
      objectives,
      createdBy: props.createdBy,
    });

    aggregate.addDomainEvent(
      new RestoreStartedEvent(
        sagaId,
        props.tenantId,
        props.recoveryType,
        props.targetEnvironment
      )
    );

    if (props.recoveryType === RecoveryType.CROSS_REGION_FAILOVER || props.recoveryType === RecoveryType.DISASTER_RECOVERY) {
      aggregate.addDomainEvent(
        new DisasterRecoveryTriggeredEvent(
          sagaId,
          props.tenantId,
          'us-east-1',
          props.targetEnvironment,
          'Manual or Automated DR Failover Initiated'
        )
      );
    }

    return aggregate;
  }

  // Getters
  public getSagaId(): string {
    return this.sagaId;
  }

  public getTenantId(): string {
    return this.tenantId;
  }

  public getBackupId(): BackupId {
    return this.backupId;
  }

  public getRecoveryType(): RecoveryType {
    return this.recoveryType;
  }

  public getStatus(): RestoreStatus {
    return this.status;
  }

  public getRequest(): RestoreRequest {
    return this.request;
  }

  public getPlan(): RestorePlan {
    return this.plan;
  }

  public getObjectives(): RecoveryObjective {
    return this.objectives;
  }

  public getValidation(): RecoveryValidation | undefined {
    return this.validation;
  }

  public getExecutedSteps(): string[] {
    return [...this.executedSteps];
  }

  public getDurationMs(): number {
    return this.durationMs;
  }

  // Step Progression & Validation
  public recordStepExecuted(stepName: string): void {
    this.executedSteps.push(stepName);
    this.updatedAt = new Date();
  }

  public completeRestore(durationMs: number): void {
    this.status = RestoreStatus.COMPLETED;
    this.durationMs = durationMs;
    this.updatedAt = new Date();

    this.addDomainEvent(
      new RestoreCompletedEvent(
        this.sagaId,
        this.tenantId,
        this.recoveryType,
        durationMs
      )
    );
  }

  public validateRestore(validation: RecoveryValidation): void {
    this.validation = validation;
    if (validation.isValid && validation.dataConsistencyScore >= 95.0) {
      this.status = RestoreStatus.VALIDATED;
    } else {
      this.status = RestoreStatus.FAILED;
    }
    this.updatedAt = new Date();

    this.addDomainEvent(
      new RecoveryValidatedEvent(
        this.sagaId,
        this.tenantId,
        validation.dataConsistencyScore,
        validation.isValid
      )
    );
  }

  public failAndRollback(reason: string): void {
    this.status = RestoreStatus.ROLLED_BACK;
    this.updatedAt = new Date();
  }

  private addDomainEvent(event: BasePlatformDomainEvent): void {
    this.uncommittedEvents.push(event);
  }

  public getUncommittedEvents(): BasePlatformDomainEvent[] {
    return [...this.uncommittedEvents];
  }

  public clearUncommittedEvents(): void {
    this.uncommittedEvents = [];
  }
}
