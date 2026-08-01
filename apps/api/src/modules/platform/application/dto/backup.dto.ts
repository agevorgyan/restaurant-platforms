/**
 * Enterprise Backup & Disaster Recovery Platform - Data Transfer Objects (DTOs)
 *
 * Command and Query DTOs for REST presentation layer validation.
 */

import { BackupStatus, BackupType, RecoveryType, RestoreStatus } from '../../domain/enums/backup.enums';

export interface CreateBackupDto {
  tenantId: string;
  backupType: BackupType;
  retentionDays?: number;
  encryptionKeyId?: string;
}

export interface InitiateRestoreDto {
  tenantId: string;
  backupId: string;
  recoveryType: RecoveryType;
  targetEnvironment: string;
  rpoMinutes?: number;
  rtoMinutes?: number;
}

export interface ValidateRecoveryDto {
  sagaId: string;
  expectedChecksum?: string;
}

export interface TriggerDisasterRecoveryDto {
  tenantId: string;
  backupId: string;
  destinationRegion: string;
  reason: string;
}

export interface BackupResponseDto {
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

export interface RestoreResponseDto {
  sagaId: string;
  tenantId: string;
  backupId: string;
  recoveryType: RecoveryType;
  status: RestoreStatus;
  targetEnvironment: string;
  executedSteps: string[];
  durationMs: number;
  meetsObjectives: boolean;
  validationResult?: {
    isValid: boolean;
    dataConsistencyScore: number;
    checkResult: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SnapshotResponseDto {
  snapshotId: string;
  backupId: string;
  tenantId: string;
  backupType: BackupType;
  sizeBytes: number;
  createdAt: string;
}

export interface ReplicationResponseDto {
  backupId: string;
  tenantId: string;
  sourceRegion: string;
  destinationRegion: string;
  isSynced: boolean;
  lagSeconds: number;
  lastSyncedAt: string;
}

export interface ValidationResponseDto {
  sagaId: string;
  isValid: boolean;
  dataConsistencyScore: number;
  validationCheckResult: string;
  validatedAt: string;
}
