/**
 * Enterprise Backup & Disaster Recovery Platform - Domain Ports (Interfaces)
 *
 * Hexagonal architecture ports for backup persistence, CQRS query projections,
 * and pluggable backup/restore engine providers.
 */

import { BackupAggregate, RestoreSagaAggregate } from '../models/backup.aggregate';
import { BackupStatus, BackupType, RecoveryType } from '../enums/backup.enums';
import { RecoveryPoint, RecoveryValidation, SnapshotId } from '../value-objects/backup-vo';
import {
  BackupCatalogReadModel,
  RecoveryStatisticsReadModel,
  ReplicationStatusReadModel,
  RestoreHistoryReadModel,
  RetentionPoliciesReadModel,
  SnapshotHistoryReadModel,
} from '../../application/read-models/backup.read-models';

export const BACKUP_REPOSITORY_TOKEN = Symbol('IBackupRepository');
export const BACKUP_QUERY_REPOSITORY_TOKEN = Symbol('IBackupQueryRepository');
export const BACKUP_PROVIDER_TOKEN = Symbol('IBackupProviderPort');

export interface IBackupRepository {
  saveBackup(backup: BackupAggregate): Promise<void>;
  saveRestoreSaga(saga: RestoreSagaAggregate): Promise<void>;
  findBackupById(id: string): Promise<BackupAggregate | null>;
  findRestoreSagaById(sagaId: string): Promise<RestoreSagaAggregate | null>;
  findBackupsByTenant(tenantId: string, backupType?: BackupType): Promise<BackupAggregate[]>;
  deleteBackup(id: string): Promise<boolean>;
}

export interface IBackupQueryRepository {
  getCatalog(tenantId?: string, backupType?: BackupType, status?: BackupStatus): Promise<BackupCatalogReadModel>;

  getSnapshotHistory(tenantId?: string): Promise<SnapshotHistoryReadModel>;

  getRestoreHistory(tenantId?: string): Promise<RestoreHistoryReadModel>;

  getReplicationStatus(tenantId?: string): Promise<ReplicationStatusReadModel>;

  getStatistics(): Promise<RecoveryStatisticsReadModel>;

  getRetentionPolicies(): Promise<RetentionPoliciesReadModel>;
}

export interface IBackupProviderPort {
  executeBackup(
    tenantId: string,
    backupType: BackupType
  ): Promise<{ sizeBytes: number; checksum: string; recoveryPoint: RecoveryPoint }>;

  executeRestore(
    tenantId: string,
    backupId: string,
    recoveryType: RecoveryType
  ): Promise<boolean>;

  validateDataConsistency(
    tenantId: string,
    backupId: string
  ): Promise<RecoveryValidation>;

  replicateCrossRegion(
    backupId: string,
    destinationRegion: string
  ): Promise<{ isSynced: boolean; lagSeconds: number }>;
}
