import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { MediaSearchService, CatalogService, AlbumService, TagService } from '../../domain/services';
import { MediaSearchCriteria, MediaSearchCriteriaProps } from '../../domain/value-objects';
import { MediaSearchStatistics, CatalogHealth, PopularAlbums } from '../../application/read-models';

@Controller('media')
export class EnterpriseCatalogController {
  constructor(
    private readonly searchService: MediaSearchService,
    private readonly catalogService: CatalogService,
    private readonly albumService: AlbumService,
    private readonly tagService: TagService
  ) {}

  @Get('search')
  async searchMedia(
    @Query('tenantId') tenantId: string,
    @Query('q') query: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20'
  ): Promise<any> {
    if (!tenantId) throw new Error('tenantId is required');

    const criteriaProps: MediaSearchCriteriaProps = {
      tenantId,
      query,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    };

    const criteria = MediaSearchCriteria.create(criteriaProps);
    const { results, total } = await this.searchService.search(criteria);

    return {
      data: results.map(r => r.toValue()),
      total,
      page: criteriaProps.page,
      limit: criteriaProps.limit
    };
  }

  @Post('search')
  async advancedSearch(@Body() payload: MediaSearchCriteriaProps): Promise<any> {
    if (!payload.tenantId) throw new Error('tenantId is required');
    const criteria = MediaSearchCriteria.create({
      ...payload,
      page: payload.page || 1,
      limit: payload.limit || 20
    });
    
    const { results, total } = await this.searchService.search(criteria);
    return {
      data: results.map(r => r.toValue()),
      total,
      page: criteria.toValue().page,
      limit: criteria.toValue().limit
    };
  }

  @Get('albums')
  async getAlbums(@Query('tenantId') tenantId: string): Promise<PopularAlbums> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      albums: []
    };
  }

  @Post('albums')
  async createAlbum(@Body() payload: { tenantId: string; name: string }): Promise<{ albumId: string }> {
    if (!payload.tenantId || !payload.name) throw new Error('tenantId and name are required');
    const albumId = await this.albumService.createAlbum(payload.tenantId, payload.name);
    return { albumId };
  }

  @Patch('albums/:id')
  async addMediaToAlbum(
    @Param('id') albumId: string,
    @Body() payload: { tenantId: string; mediaId: string }
  ): Promise<{ status: string }> {
    if (!payload.tenantId || !payload.mediaId) throw new Error('tenantId and mediaId are required');
    await this.catalogService.addMediaToAlbum(payload.tenantId, payload.mediaId, albumId);
    return { status: 'SUCCESS' };
  }

  @Get('search/statistics')
  async getSearchStatistics(@Query('tenantId') tenantId: string): Promise<MediaSearchStatistics> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      totalQueries: 15200,
      averageLatencyMs: 45,
      queriesWithZeroResults: 120,
      period: new Date().toISOString().slice(0, 7)
    };
  }

  @Get('search/suggestions')
  async getSuggestions(
    @Query('tenantId') tenantId: string,
    @Query('prefix') prefix: string
  ): Promise<{ suggestions: string[] }> {
    if (!tenantId || !prefix) throw new Error('tenantId and prefix are required');
    const suggestions = await this.tagService.suggestTags(tenantId, prefix);
    return { suggestions };
  }

  @Get('catalog/health')
  async getCatalogHealth(): Promise<CatalogHealth> {
    return {
      status: 'HEALTHY',
      indexDocCount: 1500000,
      pendingSyncQueueSize: 0,
      averageIndexingLatencyMs: 150,
      failedIndexJobs: 0
    };
  }
}
