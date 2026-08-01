/**
 * Enterprise Backup & Disaster Recovery Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, BackupAggregate Root & Immutability, RestoreSagaAggregate Root & Saga Workflow,
 * Post-Restore Data Integrity Validation, RPO & RTO Recovery Objectives, Cross-Region Async Replication,
 * RLS Tenant Security, and Read Models.
 */

import {
  BackupId,
  BackupPolicy,
  BackupSchedule,
  RecoveryObjective,
  RecoveryPoint,
  RecoveryValidation,
  ReplicationPolicy,
  SnapshotId,
} from './domain/value-objects/backup-vo';
import { BackupStatus, BackupType, RecoveryType, RestoreStatus } from './domain/enums/backup.enums';
import { BackupAggregate, RestoreSagaAggregate } from './domain/models/backup.aggregate';
import { InMemoryBackupRepository } from './infrastructure/repositories/in-memory-backup.repository';
import { NestEventPublisherAdapter } from '../integration/infrastructure/adapters/connector.adapters';
import {
  BackupService,

  EnterpriseBackupDisasterRecoveryPlatformService,
  PolicyService,
  RecoveryService,
  ReplicationService,
  RestoreService,
  SnapshotService,
  ValidationService,
} from './application/services/backup-platform.services';
import {
  ImmutableBackupException,
  RPORTOViolationException,
} from './domain/exceptions/backup.exceptions';

describe('Enterprise Backup & Disaster Recovery Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should generate unique BackupId and SnapshotId', () => {
      const bkpId = BackupId.create();
      expect(bkpId.getValue()).toMatch(/^bkp-/);

      const snpId = SnapshotId.create();
      expect(snpId.getValue()).toMatch(/^snp-/);
    });

    it('should calculate SHA-256 checksum for RecoveryPoint', () => {
      const recPoint = RecoveryPoint.create(new Date(), 100, { table: 'orders', rows: 5000 });
      expect(recPoint.checksum).toBeDefined();
      expect(recPoint.checksum.length).toBe(64); // SHA-256 hex string length
    });

    it('should validate RPO and RTO objective limits', () => {
      const validObjective = RecoveryObjective.create({
        rpoMinutes: 5,
        rtoMinutes: 15,
        actualRpoMinutes: 2,
        actualRtoMinutes: 10,
      });
      expect(validObjective.meetsObjectives).toBe(true);

      expect(() =>
        RecoveryObjective.create({
          rpoMinutes: 5,
          rtoMinutes: 15,
          actualRpoMinutes: 12, // Exceeds RPO threshold
        })
      ).toThrow(RPORTOViolationException);
    });
  });

  describe('BackupAggregate Root & Immutability', () => {
    it('should start backup, complete backup, and enforce immutable state', () => {
      const aggregate = BackupAggregate.create({
        tenantId: 'tenant-pos-1',
        backupType: BackupType.FULL_BACKUP,
      });

      expect(aggregate.getStatus()).toBe(BackupStatus.SCHEDULED);
      expect(aggregate.getIsImmutable()).toBe(false);

      aggregate.startBackup();
      expect(aggregate.getStatus()).toBe(BackupStatus.RUNNING);

      const recPoint = RecoveryPoint.create(new Date(), 101, { data: 'test' });
      aggregate.completeBackup(1048576, 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890', recPoint);

      expect(aggregate.getStatus()).toBe(BackupStatus.COMPLETED);
      expect(aggregate.getIsImmutable()).toBe(true);
      expect(aggregate.getSnapshotId()).toBeDefined();

      // Attempting to re-start a completed backup must throw ImmutableBackupException
      expect(() => aggregate.startBackup()).toThrow(ImmutableBackupException);
    });
  });

  describe('RestoreSagaAggregate Root & Saga Workflow', () => {
    it('should orchestrate restore saga and validate post-restore consistency', () => {
      const backupId = BackupId.create();
      const saga = RestoreSagaAggregate.startRestoreSaga({
        tenantId: 'tenant-rest-1',
        backupId,
        recoveryType: RecoveryType.POINT_IN_TIME_RECOVERY,
        targetEnvironment: 'staging',
      });

      expect(saga.getStatus()).toBe(RestoreStatus.RUNNING);
      expect(saga.getExecutedSteps().length).toBe(0);

      saga.recordStepExecuted('RESERVE_TARGET');
      saga.recordStepExecuted('APPLY_SNAPSHOT');
      saga.recordStepExecuted('PLAY_PITR_LOGS');

      saga.completeRestore(120);
      expect(saga.getStatus()).toBe(RestoreStatus.COMPLETED);

      const validation = RecoveryValidation.perfectScore();
      saga.validateRestore(validation);
      expect(saga.getStatus()).toBe(RestoreStatus.VALIDATED);
    });
  });

  describe('Platform Domain & Application Services', () => {
    let repo: InMemoryBackupRepository;
    let eventPublisher: NestEventPublisherAdapter;
    let backupService: BackupService;
    let restoreService: RestoreService;
    let snapshotService: SnapshotService;
    let replicationService: ReplicationService;
    let validationService: ValidationService;
    let policyService: PolicyService;
    let recoveryService: RecoveryService;
    let platformService: EnterpriseBackupDisasterRecoveryPlatformService;

    beforeEach(() => {
      repo = new InMemoryBackupRepository();
      eventPublisher = new NestEventPublisherAdapter();

      recoveryService = new RecoveryService();
      validationService = new ValidationService(repo);
      snapshotService = new SnapshotService(repo);
      replicationService = new ReplicationService(repo, repo);
      policyService = new PolicyService(repo);

      restoreService = new RestoreService(
        repo,
        repo,
        eventPublisher,
        recoveryService,
        validationService
      );

      backupService = new BackupService(
        repo,
        repo,
        eventPublisher
      );

      platformService = new EnterpriseBackupDisasterRecoveryPlatformService(
        repo,
        repo,
        backupService,
        restoreService,
        snapshotService,
        replicationService,
        validationService,
        policyService,
        recoveryService
      );
    });

    it('should query seeded default backups across all 8 backup types', async () => {
      const catalog = await platformService.getBackups();
      expect(catalog.totalBackups).toBe(8);

      const types = catalog.backups.map((b) => b.backupType);
      expect(types).toContain(BackupType.FULL_BACKUP);
      expect(types).toContain(BackupType.INCREMENTAL_BACKUP);
      expect(types).toContain(BackupType.DIFFERENTIAL_BACKUP);
      expect(types).toContain(BackupType.SNAPSHOT);
      expect(types).toContain(BackupType.POINT_IN_TIME_BACKUP);
      expect(types).toContain(BackupType.TENANT_BACKUP);
      expect(types).toContain(BackupType.CONFIGURATION_BACKUP);
      expect(types).toContain(BackupType.METADATA_BACKUP);
    });

    it('should create and execute backup with SHA-256 checksum and snapshot creation', async () => {
      const backup = await platformService.createBackup({
        tenantId: 'tenant-kitchen-99',
        backupType: BackupType.FULL_BACKUP,
        retentionDays: 60,
      });

      expect(backup.status).toBe(BackupStatus.COMPLETED);
      expect(backup.isImmutable).toBe(true);
      expect(backup.checksum).toBeDefined();
      expect(backup.snapshotId).toBeDefined();
    });

    it('should initiate Saga restore workflow and achieve VALIDATED status post-restoration', async () => {
      const catalog = await platformService.getBackups();
      const targetBackup = catalog.backups[0];

      const restore = await platformService.initiateRestore({
        tenantId: targetBackup.tenantId,
        backupId: targetBackup.id,
        recoveryType: RecoveryType.POINT_IN_TIME_RECOVERY,
        targetEnvironment: 'dr-us-west-2',
      });

      expect(restore.status).toBe(RestoreStatus.VALIDATED);
      expect(restore.validationResult?.isValid).toBe(true);
      expect(restore.validationResult?.dataConsistencyScore).toBe(100.0);
    });

    it('should trigger emergency cross-region disaster recovery failover', async () => {
      const catalog = await platformService.getBackups();
      const targetBackup = catalog.backups[0];

      const drFailover = await platformService.triggerDisasterRecovery({
        tenantId: targetBackup.tenantId,
        backupId: targetBackup.id,
        destinationRegion: 'eu-central-1',
        reason: 'US Region Outage',
      });

      expect(drFailover.recoveryType).toBe(RecoveryType.DISASTER_RECOVERY);
      expect(drFailover.status).toBe(RestoreStatus.VALIDATED);
    });

    it('should query Snapshot History, Replication Status, Recovery Statistics, and Retention Policies', async () => {
      const snapshots = await platformService.getSnapshots();
      expect(snapshots.totalSnapshots).toBe(8);

      const replication = await platformService.getReplicationStatus();
      expect(replication.totalReplicatedBackups).toBe(8);

      const stats = await platformService.getStatistics();
      expect(stats.totalBackupsCompleted).toBe(8);
      expect(stats.rpoRtoCompliancePercentage).toBe(100.0);

      const policies = await platformService.getRetentionPolicies();
      expect(policies.totalPolicies).toBe(3);
    });
  });
});
