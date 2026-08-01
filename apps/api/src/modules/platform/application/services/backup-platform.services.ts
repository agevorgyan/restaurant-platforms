/**
 * Enterprise Backup & Disaster Recovery Platform - Domain & Application Services
 *
 * Implements core domain and application services:
 * 1. SnapshotService (Point-in-Time Snapshots Management)
 * 2. RestoreService (Saga-Orchestrated Disaster Recovery Workflows)
 * 3. RecoveryService (RPO & RTO Objective Evaluation)
 * 4. ReplicationService (Cross-Region Asynchronous Replication)
 * 5. ValidationService (Post-Restore Data Integrity Validation)
 * 6. PolicyService (Retention Policies Enforcement)
 * 7. BackupService (Core Backup Lifecycle Engine)
 * 8. EnterpriseBackupDisasterRecoveryPlatformService (Platform Façade)
 */

import { Injectable, Inject, Logger } from '@nestjs/common';
import { BackupAggregate, RestoreSagaAggregate } from '../../domain/models/backup.aggregate';
import { BackupStatus, BackupType, RecoveryType, RestoreStatus } from '../../domain/enums/backup.enums';
import {
  BackupId,
  BackupPolicy,
  BackupSchedule,
  RecoveryObjective,
  RecoveryPoint,
  RecoveryValidation,
  ReplicationPolicy,
} from '../../domain/value-objects/backup-vo';
import {
  BACKUP_PROVIDER_TOKEN,
  BACKUP_QUERY_REPOSITORY_TOKEN,
  BACKUP_REPOSITORY_TOKEN,
  IBackupProviderPort,
  IBackupQueryRepository,
  IBackupRepository,
} from '../../domain/ports/backup.ports';
import { EVENT_PUBLISHER_TOKEN } from '../../../integration/application/services/connector-platform.services';
import { EventPublisherPort } from '../../../integration/domain/ports/connector.ports';
import {
  BackupResponseDto,
  CreateBackupDto,
  InitiateRestoreDto,
  RestoreResponseDto,
  TriggerDisasterRecoveryDto,
  ValidateRecoveryDto,
  ValidationResponseDto,
} from '../dto/backup.dto';
import {
  BackupCatalogReadModel,
  RecoveryStatisticsReadModel,
  ReplicationStatusReadModel,
  RestoreHistoryReadModel,
  RetentionPoliciesReadModel,
  SnapshotHistoryReadModel,
} from '../read-models/backup.read-models';
import {
  BackupNotFoundException,
  RestoreValidationFailedException,
} from '../../domain/exceptions/backup.exceptions';

/**
 * Service 1: SnapshotService
 * Manages point-in-time snapshots and snapshot history.
 */
@Injectable()
export class SnapshotService {
  constructor(
    @Inject(BACKUP_QUERY_REPOSITORY_TOKEN)
    private readonly queryRepo: IBackupQueryRepository
  ) {}

  public async getSnapshotHistory(tenantId?: string): Promise<SnapshotHistoryReadModel> {
    return this.queryRepo.getSnapshotHistory(tenantId);
  }
}

/**
 * Service 2: RecoveryService
 * Evaluates RPO & RTO recovery objectives against actual recovery performance.
 */
@Injectable()
export class RecoveryService {
  public evaluateObjectives(rpoMinutes: number = 5, rtoMinutes: number = 15, durationMs: number = 0): RecoveryObjective {
    const actualRtoMinutes = Math.ceil(durationMs / 60000);
    return RecoveryObjective.create({
      rpoMinutes,
      rtoMinutes,
      actualRpoMinutes: 1, // PITR precision
      actualRtoMinutes: Math.max(1, actualRtoMinutes),
    });
  }
}

/**
 * Service 3: ValidationService
 * Validates data integrity & consistency post-restore before marking restore VALIDATED.
 */
@Injectable()
export class ValidationService {
  constructor(
    @Inject(BACKUP_PROVIDER_TOKEN)
    private readonly provider: IBackupProviderPort
  ) {}

  public async validateRestore(tenantId: string, backupId: string): Promise<RecoveryValidation> {
    return this.provider.validateDataConsistency(tenantId, backupId);
  }
}

/**
 * Service 4: ReplicationService
 * Manages cross-region asynchronous replication and measures replication lag.
 */
@Injectable()
export class ReplicationService {
  constructor(
    @Inject(BACKUP_PROVIDER_TOKEN)
    private readonly provider: IBackupProviderPort,
    @Inject(BACKUP_QUERY_REPOSITORY_TOKEN)
    private readonly queryRepo: IBackupQueryRepository
  ) {}

  public async triggerCrossRegionReplication(
    backupId: string,
    destinationRegion: string
  ): Promise<{ isSynced: boolean; lagSeconds: number }> {
    return this.provider.replicateCrossRegion(backupId, destinationRegion);
  }

  public async getReplicationStatus(tenantId?: string): Promise<ReplicationStatusReadModel> {
    return this.queryRepo.getReplicationStatus(tenantId);
  }
}

/**
 * Service 5: PolicyService
 * Enforces retention policy days and frequency schedules.
 */
@Injectable()
export class PolicyService {
  constructor(
    @Inject(BACKUP_QUERY_REPOSITORY_TOKEN)
    private readonly queryRepo: IBackupQueryRepository
  ) {}

  public async getRetentionPolicies(): Promise<RetentionPoliciesReadModel> {
    return this.queryRepo.getRetentionPolicies();
  }
}

/**
 * Service 6: RestoreService
 * Saga-Orchestrated Disaster Recovery Engine executing step-by-step recovery workflows.
 */
@Injectable()
export class RestoreService {
  private readonly logger = new Logger(RestoreService.name);

  constructor(
    @Inject(BACKUP_REPOSITORY_TOKEN)
    private readonly repo: IBackupRepository,
    @Inject(BACKUP_PROVIDER_TOKEN)
    private readonly provider: IBackupProviderPort,
    @Inject(EVENT_PUBLISHER_TOKEN)
    private readonly eventPublisher: EventPublisherPort,
    private readonly recoveryService: RecoveryService,
    private readonly validationService: ValidationService
  ) {}

  public async executeRestoreSaga(
    dto: InitiateRestoreDto,
    createdBy: string = 'system'
  ): Promise<RestoreSagaAggregate> {
    const backup = await this.repo.findBackupById(dto.backupId);
    if (!backup) throw new BackupNotFoundException(dto.backupId);

    const objectives = this.recoveryService.evaluateObjectives(
      dto.rpoMinutes || 5,
      dto.rtoMinutes || 15
    );

    const saga = RestoreSagaAggregate.startRestoreSaga({
      tenantId: dto.tenantId,
      backupId: backup.getId(),
      recoveryType: dto.recoveryType,
      targetEnvironment: dto.targetEnvironment,
      objectives,
      createdBy,
    });

    await this.repo.saveRestoreSaga(saga);
    await this.eventPublisher.publishAll(saga.getUncommittedEvents());
    saga.clearUncommittedEvents();

    const startMs = Date.now();

    try {
      // Step 1: Reserve Target
      saga.recordStepExecuted('RESERVE_TARGET');

      // Step 2: Apply Snapshot & PITR Logs via Provider
      saga.recordStepExecuted('APPLY_SNAPSHOT');
      await this.provider.executeRestore(dto.tenantId, dto.backupId, dto.recoveryType);

      saga.recordStepExecuted('PLAY_PITR_LOGS');

      // Step 3: Complete Restore
      const durationMs = Date.now() - startMs;
      saga.completeRestore(durationMs);

      // Step 4: Mandatory Post-Restore Validation
      saga.recordStepExecuted('VALIDATE_INTEGRATION');
      const validation = await this.validationService.validateRestore(dto.tenantId, dto.backupId);

      if (!validation.isValid) {
        throw new RestoreValidationFailedException(saga.getSagaId(), validation.validationCheckResult);
      }

      saga.validateRestore(validation);
      saga.recordStepExecuted('MARK_VALIDATED');

      await this.repo.saveRestoreSaga(saga);
      await this.eventPublisher.publishAll(saga.getUncommittedEvents());
      saga.clearUncommittedEvents();

      return saga;
    } catch (error: any) {
      saga.failAndRollback(error.message || 'Restore saga failed');

      await this.repo.saveRestoreSaga(saga);
      await this.eventPublisher.publishAll(saga.getUncommittedEvents());
      saga.clearUncommittedEvents();

      throw error;
    }
  }
}

/**
 * Service 7: BackupService
 * Core Backup Aggregate Engine managing backup scheduling, execution, and immutability.
 */
@Injectable()
export class BackupService {
  constructor(
    @Inject(BACKUP_REPOSITORY_TOKEN)
    private readonly repo: IBackupRepository,
    @Inject(BACKUP_PROVIDER_TOKEN)
    private readonly provider: IBackupProviderPort,
    @Inject(EVENT_PUBLISHER_TOKEN)
    private readonly eventPublisher: EventPublisherPort
  ) {}

  public async createAndExecuteBackup(
    dto: CreateBackupDto,
    createdBy: string = 'system'
  ): Promise<BackupAggregate> {
    const policy = dto.retentionDays
      ? BackupPolicy.create({ retentionDays: dto.retentionDays, encryptionKeyId: dto.encryptionKeyId })
      : BackupPolicy.defaultPolicy();

    const aggregate = BackupAggregate.create({
      tenantId: dto.tenantId,
      backupType: dto.backupType,
      policy,
      createdBy,
    });

    await this.repo.saveBackup(aggregate);
    await this.eventPublisher.publishAll(aggregate.getUncommittedEvents());
    aggregate.clearUncommittedEvents();

    aggregate.startBackup();
    await this.repo.saveBackup(aggregate);
    await this.eventPublisher.publishAll(aggregate.getUncommittedEvents());
    aggregate.clearUncommittedEvents();

    try {
      const result = await this.provider.executeBackup(dto.tenantId, dto.backupType);
      aggregate.completeBackup(result.sizeBytes, result.checksum, result.recoveryPoint);

      await this.repo.saveBackup(aggregate);
      await this.eventPublisher.publishAll(aggregate.getUncommittedEvents());
      aggregate.clearUncommittedEvents();

      return aggregate;
    } catch (error: any) {
      aggregate.failBackup(error.message || 'Backup execution failed');
      await this.repo.saveBackup(aggregate);
      throw error;
    }
  }
}

/**
 * Service 8: EnterpriseBackupDisasterRecoveryPlatformService
 * High-level platform façade integrating all services, repositories, and event publishers.
 */
@Injectable()
export class EnterpriseBackupDisasterRecoveryPlatformService {
  constructor(
    @Inject(BACKUP_REPOSITORY_TOKEN)
    private readonly repo: IBackupRepository,
    @Inject(BACKUP_QUERY_REPOSITORY_TOKEN)
    private readonly queryRepo: IBackupQueryRepository,
    private readonly backupService: BackupService,
    private readonly restoreService: RestoreService,
    private readonly snapshotService: SnapshotService,
    private readonly replicationService: ReplicationService,
    private readonly validationService: ValidationService,
    private readonly policyService: PolicyService,
    private readonly recoveryService: RecoveryService
  ) {}

  public async getBackups(
    tenantId?: string,
    backupType?: BackupType,
    status?: BackupStatus
  ): Promise<BackupCatalogReadModel> {
    return this.queryRepo.getCatalog(tenantId, backupType, status);
  }

  public async getBackupById(id: string): Promise<BackupResponseDto> {
    const aggregate = await this.repo.findBackupById(id);
    if (!aggregate) throw new BackupNotFoundException(id);
    return this.toBackupDto(aggregate);
  }

  public async createBackup(
    dto: CreateBackupDto,
    createdBy: string = 'system'
  ): Promise<BackupResponseDto> {
    const aggregate = await this.backupService.createAndExecuteBackup(dto, createdBy);
    return this.toBackupDto(aggregate);
  }

  public async initiateRestore(
    dto: InitiateRestoreDto,
    createdBy: string = 'system'
  ): Promise<RestoreResponseDto> {
    const saga = await this.restoreService.executeRestoreSaga(dto, createdBy);
    return this.toRestoreDto(saga);
  }

  public async validateRecovery(dto: ValidateRecoveryDto): Promise<ValidationResponseDto> {
    const saga = await this.repo.findRestoreSagaById(dto.sagaId);
    if (!saga) throw new BackupNotFoundException(dto.sagaId);

    const validation = await this.validationService.validateRestore(saga.getTenantId(), saga.getBackupId().getValue());
    saga.validateRestore(validation);
    await this.repo.saveRestoreSaga(saga);

    return {
      sagaId: saga.getSagaId(),
      isValid: validation.isValid,
      dataConsistencyScore: validation.dataConsistencyScore,
      validationCheckResult: validation.validationCheckResult,
      validatedAt: validation.validatedAt.toISOString(),
    };
  }

  public async triggerDisasterRecovery(
    dto: TriggerDisasterRecoveryDto,
    createdBy: string = 'system'
  ): Promise<RestoreResponseDto> {
    const saga = await this.restoreService.executeRestoreSaga(
      {
        tenantId: dto.tenantId,
        backupId: dto.backupId,
        recoveryType: RecoveryType.DISASTER_RECOVERY,
        targetEnvironment: dto.destinationRegion,
        rpoMinutes: 5,
        rtoMinutes: 15,
      },
      createdBy
    );
    return this.toRestoreDto(saga);
  }

  public async getSnapshots(tenantId?: string): Promise<SnapshotHistoryReadModel> {
    return this.snapshotService.getSnapshotHistory(tenantId);
  }

  public async getRestoreHistory(tenantId?: string): Promise<RestoreHistoryReadModel> {
    return this.queryRepo.getRestoreHistory(tenantId);
  }

  public async getReplicationStatus(tenantId?: string): Promise<ReplicationStatusReadModel> {
    return this.replicationService.getReplicationStatus(tenantId);
  }

  public async getStatistics(): Promise<RecoveryStatisticsReadModel> {
    return this.queryRepo.getStatistics();
  }

  public async getRetentionPolicies(): Promise<RetentionPoliciesReadModel> {
    return this.policyService.getRetentionPolicies();
  }

  private toBackupDto(aggregate: BackupAggregate): BackupResponseDto {
    return {
      id: aggregate.getId().getValue(),
      tenantId: aggregate.getTenantId(),
      backupType: aggregate.getBackupType(),
      status: aggregate.getStatus(),
      policyId: aggregate.getPolicy().policyId,
      retentionDays: aggregate.getPolicy().retentionDays,
      snapshotId: aggregate.getSnapshotId()?.getValue(),
      sizeBytes: aggregate.getSizeBytes(),
      checksum: aggregate.getChecksum(),
      isImmutable: aggregate.getIsImmutable(),
      createdBy: aggregate.getCreatedBy(),
      createdAt: aggregate.getCreatedAt().toISOString(),
      updatedAt: aggregate.getUpdatedAt().toISOString(),
    };
  }

  private toRestoreDto(saga: RestoreSagaAggregate): RestoreResponseDto {
    const val = saga.getValidation();
    return {
      sagaId: saga.getSagaId(),
      tenantId: saga.getTenantId(),
      backupId: saga.getBackupId().getValue(),
      recoveryType: saga.getRecoveryType(),
      status: saga.getStatus(),
      targetEnvironment: saga.getRequest().targetEnvironment,
      executedSteps: saga.getExecutedSteps(),
      durationMs: saga.getDurationMs(),
      meetsObjectives: saga.getObjectives().meetsObjectives,
      validationResult: val
        ? {
            isValid: val.isValid,
            dataConsistencyScore: val.dataConsistencyScore,
            checkResult: val.validationCheckResult,
          }
        : undefined,
      createdBy: saga.getSagaId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
