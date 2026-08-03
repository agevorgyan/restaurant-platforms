import { Controller, Get, Post, Query, Body, Headers } from '@nestjs/common';
import { EnterpriseSearchService, SearchSuggestionService } from '../../domain/services';
import { SearchCriteria, SearchScopeEnum } from '../../domain/value-objects';
import { 
  SearchResultPage, 
  PopularSearches, 
  RecentSearches, 
  SearchStatistics, 
  SearchHealth 
} from '../../application/read-models';

@Controller('search')
export class EnterpriseSearchController {
  constructor(
    private readonly searchService: EnterpriseSearchService,
    private readonly suggestionService: SearchSuggestionService
  ) {}

  @Get()
  async globalSearch(
    @Query('tenantId') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Query('q') query: string,
    @Query('scope') scope: string = 'GLOBAL',
    @Query('limit') limit: string = '20'
  ): Promise<SearchResultPage> {
    if (!tenantId || !userId) throw new Error('tenantId and userId are required');
    
    const criteria = SearchCriteria.create({
      tenantId,
      query,
      scope: SearchScopeEnum[scope as keyof typeof SearchScopeEnum] || SearchScopeEnum.GLOBAL,
      limit: parseInt(limit, 10)
    });

    const result = await this.searchService.search(tenantId, userId, criteria);
    const resultObj = result.props;

    return {
      tenantId,
      query,
      page: 1,
      limit: criteria.props.limit,
      totalHits: resultObj.totalHits,
      hits: resultObj.hits.map(h => ({
        id: h.id,
        module: h.module,
        title: h.title,
        snippet: h.description || '',
        url: h.url || ''
      })),
      facets: resultObj.facets,
      tookMs: resultObj.tookMs
    };
  }

  @Post()
  async advancedSearch(
    @Query('tenantId') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() payload: any
  ): Promise<SearchResultPage> {
    if (!tenantId || !userId) throw new Error('tenantId and userId are required');
    
    const criteria = SearchCriteria.create({
      tenantId,
      query: payload.query,
      filters: payload.filters,
      modules: payload.modules,
      scope: payload.scope ? SearchScopeEnum[payload.scope as keyof typeof SearchScopeEnum] : SearchScopeEnum.GLOBAL,
      limit: payload.limit || 20,
      cursor: payload.cursor
    });

    const result = await this.searchService.search(tenantId, userId, criteria);
    const resultObj = result.props;

    return {
      tenantId,
      query: payload.query,
      page: 1, // simplified
      limit: criteria.props.limit,
      totalHits: resultObj.totalHits,
      hits: resultObj.hits.map(h => ({
        id: h.id,
        module: h.module,
        title: h.title,
        snippet: h.description || '',
        url: h.url || ''
      })),
      facets: resultObj.facets,
      tookMs: resultObj.tookMs
    };
  }

  @Get('suggestions')
  async getSuggestions(
    @Query('tenantId') tenantId: string,
    @Query('q') prefix: string
  ): Promise<any> {
    if (!tenantId || !prefix) throw new Error('tenantId and q are required');
    const suggestions = await this.suggestionService.getSuggestions(tenantId, prefix);
    return { suggestions: suggestions.map(s => s.props) };
  }

  @Get('popular')
  async getPopularSearches(@Query('tenantId') tenantId: string): Promise<PopularSearches> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      period: '7d',
      searches: [
        { query: 'invoice 2024', count: 1450 },
        { query: 'kitchen inventory', count: 890 }
      ]
    };
  }

  @Get('recent')
  async getRecentSearches(
    @Query('tenantId') tenantId: string,
    @Headers('x-user-id') userId: string
  ): Promise<RecentSearches> {
    if (!tenantId || !userId) throw new Error('tenantId and userId are required');
    return {
      tenantId,
      userId,
      searches: []
    };
  }

  @Get('statistics')
  async getSearchStatistics(@Query('tenantId') tenantId: string): Promise<SearchStatistics> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      totalQueries: 500000,
      zeroHitQueries: 12000,
      averageLatencyMs: 35,
      p95LatencyMs: 85,
      topModules: [
        { module: 'CRM', hitCount: 250000 },
        { module: 'Finance', hitCount: 150000 }
      ]
    };
  }

  @Get('health')
  async getHealth(): Promise<SearchHealth> {
    return {
      clusterStatus: 'green',
      activeNodes: 5,
      totalDocuments: 15000000,
      pendingSyncQueueSize: 15,
      averageIndexLatencyMs: 250
    };
  }
}
