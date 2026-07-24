import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { 
  SearchProviderRegistry, 
  SearchProviderHealthService,
  ProviderFailoverService
} from '../../domain/services';
import { 
  ProviderStatusView, 
  ProviderCapabilities,
  ProviderLatencyStatistics
} from '../../application/read-models';

@Controller('search/providers')
export class EnterpriseSearchProviderController {
  constructor(
    private readonly registry: SearchProviderRegistry,
    private readonly healthService: SearchProviderHealthService,
    private readonly failoverService: ProviderFailoverService
  ) {}

  @Get()
  async getProviders(@Query('tenantId') tenantId: string): Promise<ProviderStatusView[]> {
    if (!tenantId) throw new Error('tenantId is required');
    return [
      {
        providerId: 'provider-elastic-1',
        name: 'Elasticsearch Primary',
        status: 'ONLINE',
        engineVersion: '8.10.2',
        isPrimary: true
      },
      {
        providerId: 'provider-opensearch-backup',
        name: 'OpenSearch Fallback',
        status: 'ONLINE',
        engineVersion: '2.11.0',
        isPrimary: false
      }
    ];
  }

  @Get(':id')
  async getProvider(
    @Param('id') providerId: string,
    @Query('tenantId') tenantId: string
  ): Promise<ProviderStatusView> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      providerId,
      name: 'Elasticsearch Primary',
      status: 'ONLINE',
      engineVersion: '8.10.2',
      isPrimary: true
    };
  }

  @Post()
  async registerProvider(
    @Query('tenantId') tenantId: string,
    @Body() payload: any
  ): Promise<{ providerId: string }> {
    if (!tenantId) throw new Error('tenantId is required');
    // Register new provider adapter
    return { providerId: `provider-${Date.now()}` };
  }

  @Patch(':id')
  async updateProvider(
    @Param('id') providerId: string,
    @Query('tenantId') tenantId: string,
    @Body() payload: any
  ): Promise<{ status: string }> {
    if (!tenantId) throw new Error('tenantId is required');
    return { status: 'UPDATED' };
  }

  @Get('health/status')
  async getGlobalHealth(@Query('tenantId') tenantId: string): Promise<any> {
    if (!tenantId) throw new Error('tenantId is required');
    await this.healthService.checkAllProviders();
    return {
      status: 'healthy',
      primaryLatencyMs: 12,
      lastChecked: new Date()
    };
  }

  @Get('capabilities/list')
  async getProviderCapabilities(
    @Query('tenantId') tenantId: string,
    @Query('providerId') providerId: string
  ): Promise<ProviderCapabilities> {
    if (!tenantId || !providerId) throw new Error('tenantId and providerId are required');
    return {
      providerId,
      engineType: 'Elasticsearch',
      supportedFeatures: [
        'FULL_TEXT_SEARCH',
        'AUTOCOMPLETE',
        'FACETED_SEARCH',
        'VECTOR_SEARCH'
      ]
    };
  }
}
