import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { 
  StorageProviderRegistry, 
  ProviderHealthService,
  StorageRoutingService
} from '../../domain/services';
import { 
  RegisteredProvider, 
  ProviderHealthModel,
  ProviderStatistics
} from '../../application/read-models';

@Controller('storage/providers')
export class EnterpriseStorageProviderController {
  constructor(
    private readonly registry: StorageProviderRegistry,
    private readonly healthService: ProviderHealthService,
    private readonly routingService: StorageRoutingService
  ) {}

  @Get()
  async getProviders(): Promise<RegisteredProvider[]> {
    const providers = this.registry.getAllProviders();
    return providers.map(p => ({
      name: p.name,
      capabilities: p.getCapabilities().value,
      isActive: true
    }));
  }

  @Get('health')
  async getAllHealth(): Promise<ProviderHealthModel[]> {
    const healthData = await this.healthService.getAllHealth();
    return Object.entries(healthData).map(([name, health]) => ({
      providerName: name,
      status: health.isAvailable ? 'HEALTHY' : 'DOWN',
      latencyMs: health.latencyMs,
      lastChecked: health.lastChecked,
      details: health.details
    }));
  }

  @Get(':name/health')
  async getProviderHealth(@Param('name') name: string): Promise<ProviderHealthModel> {
    const health = await this.healthService.getHealth(name);
    return {
      providerName: name,
      status: health.isAvailable ? 'HEALTHY' : 'DOWN',
      latencyMs: health.latencyMs,
      lastChecked: health.lastChecked,
      details: health.details
    };
  }

  @Get('statistics')
  async getStatistics(): Promise<ProviderStatistics[]> {
    // Mock statistics for the registry
    return this.registry.getAllProviders().map(p => ({
      providerName: p.name,
      totalUploads: Math.floor(Math.random() * 10000),
      totalDownloads: Math.floor(Math.random() * 50000),
      successRate: 99.9,
      averageLatencyMs: 45,
      dataTransferredBytes: 1024 * 1024 * 1024 * 5, // 5GB
      period: new Date().toISOString().slice(0, 7)
    }));
  }

  @Post('test')
  async testProviderRouting(@Body() payload: { tenantId: string, requirements: any }): Promise<{ selectedProvider: string }> {
    const provider = await this.routingService.determineOptimalProvider(payload.tenantId, payload.requirements);
    return {
      selectedProvider: provider.name
    };
  }
}
