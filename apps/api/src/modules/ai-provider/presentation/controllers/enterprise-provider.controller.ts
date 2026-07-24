import { Controller, Get, Post, Patch, Param, Body, Query, Headers } from '@nestjs/common';
import { 
  ProviderStatusView,
  ModelCatalog,
  ProviderCapabilities
} from '../../application/read-models';

@Controller('ai/providers')
export class EnterpriseAiProviderController {
  
  @Get()
  async getProviders(): Promise<ProviderStatusView[]> {
    return [
      {
        providerId: 'openai-1',
        name: 'OpenAI',
        status: 'ONLINE',
        latencyMs: 120,
        lastChecked: new Date()
      },
      {
        providerId: 'anthropic-1',
        name: 'Anthropic',
        status: 'ONLINE',
        latencyMs: 180,
        lastChecked: new Date()
      }
    ];
  }

  @Get('health')
  async getHealth(): Promise<{ healthy: number; degraded: number; offline: number }> {
    return {
      healthy: 2,
      degraded: 0,
      offline: 0
    };
  }

  @Get('capabilities')
  async getCapabilities(): Promise<ProviderCapabilities[]> {
    return [
      {
        providerId: 'openai-1',
        supportedCapabilities: ['CHAT', 'REASONING', 'EMBEDDING', 'IMAGE_GENERATION']
      }
    ];
  }

  @Get(':id')
  async getProvider(@Param('id') providerId: string): Promise<ProviderStatusView> {
    return {
      providerId,
      name: 'Requested Provider',
      status: 'ONLINE',
      latencyMs: 150,
      lastChecked: new Date()
    };
  }

  @Post()
  async registerProvider(@Body() payload: any): Promise<{ providerId: string }> {
    return { providerId: 'new-provider-id' };
  }

  @Patch(':id')
  async configureProvider(
    @Param('id') providerId: string,
    @Body() payload: any,
    @Query('tenantId') tenantId: string
  ): Promise<{ status: string }> {
    if (!tenantId) throw new Error('tenantId is required for configuration');
    // Save provider config/credentials per tenant
    return { status: 'CONFIGURED' };
  }

  @Get('../models')
  async getModels(): Promise<ModelCatalog[]> {
    return [
      {
        modelId: 'gpt-4o',
        name: 'GPT-4o',
        providerId: 'openai-1',
        capabilities: ['CHAT', 'REASONING'],
        maxContextTokens: 128000,
        inputCostPer1k: 0.005,
        outputCostPer1k: 0.015
      }
    ];
  }

  @Get('../models/:id')
  async getModel(@Param('id') modelId: string): Promise<ModelCatalog> {
    return {
      modelId,
      name: 'Requested Model',
      providerId: 'some-provider',
      capabilities: ['CHAT'],
      maxContextTokens: 8000,
      inputCostPer1k: 0.001,
      outputCostPer1k: 0.002
    };
  }
}
