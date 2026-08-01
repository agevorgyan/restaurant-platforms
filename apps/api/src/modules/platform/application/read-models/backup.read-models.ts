/**
 * Enterprise Backup & Disaster Recovery Platform - Read Models (CQRS Queries)
 *
 * Strongly-typed read projections for backup catalog, snapshot history, restore saga history,
 * cross-region replication status, recovery statistics, and retention policies.
 */

import { BackupStatus, BackupType, RecoveryType, RestoreStatus } from '../../domain/enums/backup.enums';

export interface BackupSummaryReadModel {
  id: string;
  tenantId: string;
  backupType: BackupType;
  status: BackupStatus;
  policyId: string;
  retentionDays: number;
  snapshotId?: string;
  sizeBytes: number;
  checksum: string;
  isImmutable: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackupCatalogReadModel {
  tenantId?: string;
  totalBackups: number;
  backups: BackupSummaryReadModel[];
}

export interface SnapshotHistoryEntry {
  snapshotId: string;
  backupId: string;
  tenantId: string;
  backupType: BackupType;
  sizeBytes: number;
  createdAt: string;
}

export interface SnapshotHistoryReadModel {
  tenantId?: string;
  totalSnapshots: number;
  snapshots: SnapshotHistoryEntry[];
}

export interface RestoreSagaHistoryEntry {
  sagaId: string;
  backupId: string;
  tenantId: string;
  recoveryType: RecoveryType;
  status: RestoreStatus;
  targetEnvironment: string;
  durationMs: number;
  dataConsistencyScore?: number;
  meetsObjectives: boolean;
  timestamp: string;
}

export interface RestoreHistoryReadModel {
  tenantId?: string;
  totalRestores: number;
  history: RestoreSagaHistoryEntry[];
}

export interface ReplicationStatusEntry {
  backupId: string;
  tenantId: string;
  sourceRegion: string;
  destinationRegion: string;
  isSynced: boolean;
  lagSeconds: number;
  lastSyncedAt: string;
}

export interface ReplicationStatusReadModel {
  tenantId?: string;
  totalReplicatedBackups: number;
  replications: ReplicationStatusEntry[];
}

export interface RecoveryStatisticsReadModel {
  totalBackupsCompleted: number;
  totalRestoresExecuted: number;
  successfulRestoresCount: number;
  validatedRestoresCount: number;
  failedRestoresCount: number;
  averageBackupDurationMs: number;
  averageRestoreDurationMs: number;
  averageRPOMinutes: number;
  averageRTOMinutes: number;
  rpoRtoCompliancePercentage: number;
}

export interface RetentionPolicyItem {
  policyId: string;
  retentionDays: number;
  frequencyMinutes: number;
  encryptionKeyId: string;
  activeTenantsCount: number;
}

export interface RetentionPoliciesReadModel {
  totalPolicies: number;
  policies: RetentionPolicyItem[];
}
