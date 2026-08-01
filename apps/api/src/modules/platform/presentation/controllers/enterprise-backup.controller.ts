/**
 * Enterprise Backup & Disaster Recovery Platform - REST Controller
 *
 * Exposes production REST API endpoints for backup catalog queries, backup execution,
 * Saga-orchestrated restore workflows, snapshot history, RPO/RTO validation, and cross-region DR failover triggers.
 *
 * API Base Path: /platform
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EnterpriseBackupDisasterRecoveryPlatformService } from '../../application/services/backup-platform.services';
import {
  BackupResponseDto,
  CreateBackupDto,
  InitiateRestoreDto,
  RestoreResponseDto,
  TriggerDisasterRecoveryDto,
  ValidateRecoveryDto,
  ValidationResponseDto,
} from '../../application/dto/backup.dto';
import {
  BackupCatalogReadModel,
  RecoveryStatisticsReadModel,
  ReplicationStatusReadModel,
  RestoreHistoryReadModel,
  RetentionPoliciesReadModel,
  SnapshotHistoryReadModel,
} from '../../application/read-models/backup.read-models';
import { BackupStatus, BackupType } from '../../domain/enums/backup.enums';

@Controller('platform')
export class EnterpriseBackupController {
  constructor(private readonly backupPlatformService: EnterpriseBackupDisasterRecoveryPlatformService) {}

  /**
   * GET /platform/backups
   * Query backup catalog. Filterable by tenantId, backupType, and status.
   */
  @Get('backups')
  async getBackups(
    @Query('tenantId') tenantId?: string,
    @Query('backupType') backupType?: BackupType,
    @Query('status') status?: BackupStatus
  ): Promise<BackupCatalogReadModel> {
    return this.backupPlatformService.getBackups(tenantId, backupType, status);
  }

  /**
   * POST /platform/backups
   * Create and execute a new backup for target tenant.
   */
  @Post('backups')
  @HttpCode(HttpStatus.CREATED)
  async createBackup(
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: CreateBackupDto
  ): Promise<BackupResponseDto> {
    const createdBy = userIdHeader || 'system';
    return this.backupPlatformService.createBackup(dto, createdBy);
  }

  /**
   * POST /platform/backups/restore
   * Initiate a Saga-orchestrated restore or point-in-time recovery workflow.
   */
  @Post('backups/restore')
  @HttpCode(HttpStatus.OK)
  async initiateRestore(
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: InitiateRestoreDto
  ): Promise<RestoreResponseDto> {
    const createdBy = userIdHeader || 'system';
    return this.backupPlatformService.initiateRestore(dto, createdBy);
  }

  /**
   * GET /platform/snapshots
   * Query point-in-time snapshot history.
   */
  @Get('snapshots')
  async getSnapshots(
    @Query('tenantId') tenantId?: string
  ): Promise<SnapshotHistoryReadModel> {
    return this.backupPlatformService.getSnapshots(tenantId);
  }

  /**
   * GET /platform/recovery
   * Query restore saga execution logs & recovery history.
   */
  @Get('recovery')
  async getRestoreHistory(
    @Query('tenantId') tenantId?: string
  ): Promise<RestoreHistoryReadModel> {
    return this.backupPlatformService.getRestoreHistory(tenantId);
  }

  /**
   * POST /platform/recovery/validate
   * Validate post-restore data integrity, checksums, and consistency scores.
   */
  @Post('recovery/validate')
  @HttpCode(HttpStatus.OK)
  async validateRecovery(
    @Body() dto: ValidateRecoveryDto
  ): Promise<ValidationResponseDto> {
    return this.backupPlatformService.validateRecovery(dto);
  }

  /**
   * POST /platform/recovery/failover
   * Trigger emergency cross-region disaster recovery failover.
   */
  @Post('recovery/failover')
  @HttpCode(HttpStatus.OK)
  async triggerDisasterRecovery(
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: TriggerDisasterRecoveryDto
  ): Promise<RestoreResponseDto> {
    const createdBy = userIdHeader || 'system';
    return this.backupPlatformService.triggerDisasterRecovery(dto, createdBy);
  }

  /**
   * GET /platform/backups/replication
   * Query cross-region async replication status & sync lag seconds.
   */
  @Get('backups/replication')
  async getReplicationStatus(
    @Query('tenantId') tenantId?: string
  ): Promise<ReplicationStatusReadModel> {
    return this.backupPlatformService.getReplicationStatus(tenantId);
  }

  /**
   * GET /platform/backups/statistics
   * Query recovery statistics, average duration, and RPO/RTO compliance ratios.
   */
  @Get('backups/statistics')
  async getStatistics(): Promise<RecoveryStatisticsReadModel> {
    return this.backupPlatformService.getStatistics();
  }

  /**
   * GET /platform/backups/policies
   * Query active backup retention policies.
   */
  @Get('backups/policies')
  async getRetentionPolicies(): Promise<RetentionPoliciesReadModel> {
    return this.backupPlatformService.getRetentionPolicies();
  }

  /**
   * GET /platform/backups/:id
   * Retrieve single backup definition by ID.
   */
  @Get('backups/:id')
  async getBackupById(@Param('id') id: string): Promise<BackupResponseDto> {
    return this.backupPlatformService.getBackupById(id);
  }
}
