/**
 * Enterprise Backup & Disaster Recovery Platform - Infrastructure Repository & Pluggable Provider
 *
 * Implements IBackupRepository, IBackupQueryRepository, and IBackupProviderPort for multi-tenant backup storage,
 * CQRS read models, pluggable backup execution, and cross-region replication simulation.
 */

import { Injectable } from '@nestjs/common';
import { BackupAggregate, RestoreSagaAggregate } from '../../domain/models/backup.aggregate';
import { BackupStatus, BackupType, RecoveryType, RestoreStatus } from '../../domain/enums/backup.enums';
import {
  BackupId,
  BackupPolicy,
  BackupSchedule,
  RecoveryPoint,
  RecoveryValidation,
  SnapshotId,
} from '../../domain/value-objects/backup-vo';
import {
  IBackupProviderPort,
  IBackupQueryRepository,
  IBackupRepository,
} from '../../domain/ports/backup.ports';
import {
  BackupCatalogReadModel,
  RecoveryStatisticsReadModel,
  ReplicationStatusReadModel,
  RestoreHistoryReadModel,
  RetentionPoliciesReadModel,
  SnapshotHistoryReadModel,
} from '../../application/read-models/backup.read-models';

@Injectable()
export class InMemoryBackupRepository
  implements IBackupRepository, IBackupQueryRepository, IBackupProviderPort
{
  private readonly backupMap = new Map<string, BackupAggregate>();
  private readonly restoreSagaMap = new Map<string, RestoreSagaAggregate>();

  constructor() {
    this.seedDefaultBackups();
  }

  // --- IBackupRepository Implementation ---

  public async saveBackup(backup: BackupAggregate): Promise<void> {
    this.backupMap.set(backup.getId().getValue(), backup);
  }

  public async saveRestoreSaga(saga: RestoreSagaAggregate): Promise<void> {
    this.restoreSagaMap.set(saga.getSagaId(), saga);
  }

  public async findBackupById(id: string): Promise<BackupAggregate | null> {
    return this.backupMap.get(id) || null;
  }

  public async findRestoreSagaById(sagaId: string): Promise<RestoreSagaAggregate | null> {
    return this.restoreSagaMap.get(sagaId) || null;
  }

  public async findBackupsByTenant(tenantId: string, backupType?: BackupType): Promise<BackupAggregate[]> {
    const list: BackupAggregate[] = [];
    for (const b of this.backupMap.values()) {
      if (b.getTenantId() === tenantId) {
        if (!backupType || b.getBackupType() === backupType) {
          list.push(b);
        }
      }
    }
    return list;
  }

  public async deleteBackup(id: string): Promise<boolean> {
    return this.backupMap.delete(id);
  }

  // --- IBackupQueryRepository Implementation ---

  public async getCatalog(tenantId?: string, backupType?: BackupType, status?: BackupStatus): Promise<BackupCatalogReadModel> {
    const list: BackupAggregate[] = [];
    for (const b of this.backupMap.values()) {
      if (tenantId && b.getTenantId() !== tenantId) continue;
      if (backupType && b.getBackupType() !== backupType) continue;
      if (status && b.getStatus() !== status) continue;
      list.push(b);
    }

    const backups = list.map((b) => ({
      id: b.getId().getValue(),
      tenantId: b.getTenantId(),
      backupType: b.getBackupType(),
      status: b.getStatus(),
      policyId: b.getPolicy().policyId,
      retentionDays: b.getPolicy().retentionDays,
      snapshotId: b.getSnapshotId()?.getValue(),
      sizeBytes: b.getSizeBytes(),
      checksum: b.getChecksum(),
      isImmutable: b.getIsImmutable(),
      createdBy: b.getCreatedBy(),
      createdAt: b.getCreatedAt().toISOString(),
      updatedAt: b.getUpdatedAt().toISOString(),
    }));

    return {
      tenantId,
      totalBackups: backups.length,
      backups,
    };
  }

  public async getSnapshotHistory(tenantId?: string): Promise<SnapshotHistoryReadModel> {
    const list: BackupAggregate[] = [];
    for (const b of this.backupMap.values()) {
      if (tenantId && b.getTenantId() !== tenantId) continue;
      if (b.getSnapshotId()) list.push(b);
    }

    const snapshots = list.map((b) => ({
      snapshotId: b.getSnapshotId()!.getValue(),
      backupId: b.getId().getValue(),
      tenantId: b.getTenantId(),
      backupType: b.getBackupType(),
      sizeBytes: b.getSizeBytes(),
      createdAt: b.getCreatedAt().toISOString(),
    }));

    return {
      tenantId,
      totalSnapshots: snapshots.length,
      snapshots,
    };
  }

  public async getRestoreHistory(tenantId?: string): Promise<RestoreHistoryReadModel> {
    const list: RestoreSagaAggregate[] = [];
    for (const r of this.restoreSagaMap.values()) {
      if (tenantId && r.getTenantId() !== tenantId) continue;
      list.push(r);
    }

    const history = list.map((r) => ({
      sagaId: r.getSagaId(),
      backupId: r.getBackupId().getValue(),
      tenantId: r.getTenantId(),
      recoveryType: r.getRecoveryType(),
      status: r.getStatus(),
      targetEnvironment: r.getRequest().targetEnvironment,
      durationMs: r.getDurationMs(),
      dataConsistencyScore: r.getValidation()?.dataConsistencyScore,
      meetsObjectives: r.getObjectives().meetsObjectives,
      timestamp: new Date().toISOString(),
    }));

    return {
      tenantId,
      totalRestores: history.length,
      history,
    };
  }

  public async getReplicationStatus(tenantId?: string): Promise<ReplicationStatusReadModel> {
    const list = Array.from(this.backupMap.values()).filter((b) => !tenantId || b.getTenantId() === tenantId);

    const replications = list.map((b) => ({
      backupId: b.getId().getValue(),
      tenantId: b.getTenantId(),
      sourceRegion: 'us-east-1',
      destinationRegion: 'us-west-2',
      isSynced: true,
      lagSeconds: 12,
      lastSyncedAt: b.getUpdatedAt().toISOString(),
    }));

    return {
      tenantId,
      totalReplicatedBackups: replications.length,
      replications,
    };
  }

  public async getStatistics(): Promise<RecoveryStatisticsReadModel> {
    const backups = Array.from(this.backupMap.values());
    const restores = Array.from(this.restoreSagaMap.values());

    const completedBackups = backups.filter((b) => b.getStatus() === BackupStatus.COMPLETED).length;
    const validatedRestores = restores.filter((r) => r.getStatus() === RestoreStatus.VALIDATED).length;

    return {
      totalBackupsCompleted: completedBackups,
      totalRestoresExecuted: restores.length,
      successfulRestoresCount: restores.filter((r) => r.getStatus() === RestoreStatus.COMPLETED || r.getStatus() === RestoreStatus.VALIDATED).length,
      validatedRestoresCount: validatedRestores,
      failedRestoresCount: restores.filter((r) => r.getStatus() === RestoreStatus.FAILED || r.getStatus() === RestoreStatus.ROLLED_BACK).length,
      averageBackupDurationMs: 320.0,
      averageRestoreDurationMs: 450.0,
      averageRPOMinutes: 1.0,
      averageRTOMinutes: 2.0,
      rpoRtoCompliancePercentage: 100.0,
    };
  }

  public async getRetentionPolicies(): Promise<RetentionPoliciesReadModel> {
    return {
      totalPolicies: 3,
      policies: [
        { policyId: 'policy-daily-30d', retentionDays: 30, frequencyMinutes: 1440, encryptionKeyId: 'kms-key-default-aes256', activeTenantsCount: 15 },
        { policyId: 'policy-hourly-7d', retentionDays: 7, frequencyMinutes: 60, encryptionKeyId: 'kms-key-high-freq-aes256', activeTenantsCount: 8 },
        { policyId: 'policy-enterprise-365d', retentionDays: 365, frequencyMinutes: 1440, encryptionKeyId: 'kms-key-enterprise-hsm', activeTenantsCount: 5 },
      ],
    };
  }

  // --- IBackupProviderPort Implementation ---

  public async executeBackup(
    tenantId: string,
    backupType: BackupType
  ): Promise<{ sizeBytes: number; checksum: string; recoveryPoint: RecoveryPoint }> {
    const sizeBytes = backupType === BackupType.FULL_BACKUP ? 104857600 : 5242880; // 100MB or 5MB
    const recoveryPoint = RecoveryPoint.create(new Date(), 1001, { tenantId, backupType });

    return {
      sizeBytes,
      checksum: recoveryPoint.checksum,
      recoveryPoint,
    };
  }

  public async executeRestore(
    tenantId: string,
    backupId: string,
    recoveryType: RecoveryType
  ): Promise<boolean> {
    return true;
  }

  public async validateDataConsistency(
    tenantId: string,
    backupId: string
  ): Promise<RecoveryValidation> {
    return RecoveryValidation.perfectScore();
  }

  public async replicateCrossRegion(
    backupId: string,
    destinationRegion: string
  ): Promise<{ isSynced: boolean; lagSeconds: number }> {
    return { isSynced: true, lagSeconds: 8 };
  }

  // Seed Out-of-the-box Default Backups across all 8 Backup Types
  private seedDefaultBackups(): void {
    const types = [
      BackupType.FULL_BACKUP,
      BackupType.INCREMENTAL_BACKUP,
      BackupType.DIFFERENTIAL_BACKUP,
      BackupType.SNAPSHOT,
      BackupType.POINT_IN_TIME_BACKUP,
      BackupType.TENANT_BACKUP,
      BackupType.CONFIGURATION_BACKUP,
      BackupType.METADATA_BACKUP,
    ];

    types.forEach((bType, idx) => {
      const id = BackupId.create(`bkp-seed-${idx + 1}`);
      const tenantId = `tenant-seed-${(idx % 3) + 1}`;
      const policy = BackupPolicy.defaultPolicy();
      const schedule = BackupSchedule.daily();
      const recPoint = RecoveryPoint.create(new Date(), 1000 + idx, { seedIdx: idx });

      const aggregate = BackupAggregate.reconstitute({
        id,
        tenantId,
        backupType: bType,
        policy,
        schedule,
        snapshotId: SnapshotId.create(`snp-seed-${idx + 1}`),
        status: BackupStatus.COMPLETED,
        sizeBytes: 10485760 * (idx + 1),
        checksum: recPoint.checksum,
        isImmutable: true,
        recoveryPoint: recPoint,
        createdBy: 'system-seeder',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      this.backupMap.set(id.getValue(), aggregate);
    });
  }
}
