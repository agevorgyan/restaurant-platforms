import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { 
  MediaVersionService, 
  RestoreService, 
  ArchiveService, 
  LifecycleManagementService,
  CacheInvalidationService
} from '../../domain/services';
import { MediaVersionHistory, RetentionStatistics } from '../../application/read-models';

@Controller('media')
export class EnterpriseVersioningController {
  constructor(
    private readonly versionService: MediaVersionService,
    private readonly restoreService: RestoreService,
    private readonly archiveService: ArchiveService,
    private readonly lifecycleService: LifecycleManagementService,
    private readonly cacheService: CacheInvalidationService
  ) {}

  @Get(':id/versions')
  async getVersions(
    @Param('id') mediaId: string,
    @Query('tenantId') tenantId: string
  ): Promise<MediaVersionHistory> {
    if (!tenantId) throw new Error('tenantId is required');
    
    return {
      mediaId,
      tenantId,
      currentVersionId: 'v2',
      versions: [
        { versionId: 'v2', versionNumber: 2, status: 'CURRENT', storageKey: '...', createdAt: new Date() },
        { versionId: 'v1', versionNumber: 1, status: 'PREVIOUS', storageKey: '...', createdAt: new Date() }
      ]
    };
  }

  @Get(':id/versions/:versionId')
  async getVersion(
    @Param('id') mediaId: string,
    @Param('versionId') versionId: string,
    @Query('tenantId') tenantId: string
  ): Promise<any> {
    if (!tenantId) throw new Error('tenantId is required');
    return { versionId, versionNumber: 1, status: 'PREVIOUS' };
  }

  @Post(':id/versions/restore')
  async restoreVersion(
    @Param('id') mediaId: string,
    @Body() payload: { tenantId: string; versionId: string }
  ): Promise<{ status: string }> {
    if (!payload.tenantId || !payload.versionId) throw new Error('tenantId and versionId are required');
    await this.restoreService.restoreVersion(payload.tenantId, mediaId, payload.versionId);
    return { status: 'RESTORE_INITIATED' };
  }

  @Post(':id/archive')
  async archiveMedia(
    @Param('id') mediaId: string,
    @Body() payload: { tenantId: string; versionId?: string }
  ): Promise<{ status: string }> {
    if (!payload.tenantId) throw new Error('tenantId is required');
    await this.archiveService.archiveVersion(payload.tenantId, mediaId, payload.versionId || 'CURRENT');
    return { status: 'ARCHIVE_INITIATED' };
  }

  @Post(':id/delete')
  async deleteMedia(
    @Param('id') mediaId: string,
    @Body() payload: { tenantId: string; hardDelete?: boolean }
  ): Promise<{ status: string }> {
    if (!payload.tenantId) throw new Error('tenantId is required');
    await this.lifecycleService.deleteMedia(payload.tenantId, mediaId, payload.hardDelete);
    return { status: payload.hardDelete ? 'HARD_DELETED' : 'SOFT_DELETED' };
  }

  @Post(':id/cache/invalidate')
  async invalidateCache(
    @Param('id') mediaId: string,
    @Body() payload: { tenantId: string; versionId?: string }
  ): Promise<{ status: string }> {
    if (!payload.tenantId) throw new Error('tenantId is required');
    await this.cacheService.invalidateVersion(payload.tenantId, mediaId, payload.versionId || 'CURRENT');
    return { status: 'INVALIDATION_REQUESTED' };
  }

  @Get('lifecycle/statistics')
  async getLifecycleStatistics(@Query('tenantId') tenantId: string): Promise<RetentionStatistics> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      totalAssetsUnderRetention: 50000,
      assetsExpiringNext30Days: 1200,
      period: new Date().toISOString().slice(0, 7)
    };
  }
}
