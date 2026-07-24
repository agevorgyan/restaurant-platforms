import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MediaDeliveryService, CacheManagementService } from '../../domain/services';
import { CacheStatistics, DeliveryStatistics, ProviderHealth } from '../../application/read-models';

@Controller('media')
export class EnterpriseDeliveryController {
  constructor(
    private readonly deliveryService: MediaDeliveryService,
    private readonly cacheService: CacheManagementService
  ) {}

  @Get('delivery')
  async getDeliveryUrl(
    @Query('tenantId') tenantId: string,
    @Query('mediaId') mediaId: string,
    @Query('storageKey') storageKey: string
  ): Promise<{ url: string }> {
    if (!tenantId || !mediaId || !storageKey) {
      throw new Error('tenantId, mediaId, and storageKey are required');
    }

    // Default to public caching edge URL
    const url = await this.deliveryService.getDeliveryUrl(tenantId, mediaId, storageKey, false);
    return { url };
  }

  @Post('delivery/url')
  async generateSignedUrl(@Body() payload: any): Promise<{ url: string }> {
    const { tenantId, mediaId, storageKey, ttlSeconds } = payload;
    if (!tenantId || !mediaId || !storageKey) {
      throw new Error('tenantId, mediaId, and storageKey are required');
    }

    // Generate secure, signed URL for private assets
    const url = await this.deliveryService.getDeliveryUrl(tenantId, mediaId, storageKey, true, ttlSeconds || 3600);
    return { url };
  }

  @Post('cache/invalidate')
  async invalidateCache(@Body() payload: { cacheKeys: string[] }): Promise<{ status: string }> {
    if (!payload.cacheKeys || !Array.isArray(payload.cacheKeys)) {
      throw new Error('cacheKeys array is required');
    }

    await this.cacheService.purge(payload.cacheKeys);
    return { status: 'INVALIDATION_QUEUED' };
  }

  @Get('cache/statistics')
  async getCacheStatistics(@Query('tenantId') tenantId: string): Promise<CacheStatistics> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      cacheHitRatio: 0.95, // 95%
      cacheMissRatio: 0.05,
      totalPurgeRequests: 120,
      period: new Date().toISOString().slice(0, 7)
    };
  }

  @Get('delivery/health')
  async getHealth(): Promise<{ providers: ProviderHealth[] }> {
    return {
      providers: [
        {
          providerName: 'Cloudflare',
          isAvailable: true,
          latencyMs: 12,
          errorRate: 0.01,
          lastCheckedAt: new Date()
        }
      ]
    };
  }
}
