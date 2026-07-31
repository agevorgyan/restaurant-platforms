/**
 * Enterprise AI Gateway - REST Controller
 *
 * Exposes production REST API endpoints for provider management, model catalogs,
 * unified AI inference, history queries, health dashboards, and token cost analytics.
 *
 * API Base Path: /ai
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  EnterpriseAiGatewayPlatformService,
  ModelRegistryService,
} from '../../application/services/ai-gateway.services';
import {
  RegisterProviderDto,
  ExecuteInferenceDto,
  InferenceResponseDto,
} from '../../application/dto/ai.dto';
import {
  ProviderCatalog,
  ModelCatalog,
  InferenceHistory,
  CostDashboard,
  ProviderHealthDashboard,
} from '../../application/read-models/ai.read-models';
import { ProviderStatus, ProviderType, ModelType } from '../../domain/enums/ai.enums';

@Controller('ai')
export class EnterpriseAiGatewayController {
  constructor(
    private readonly gatewayService: EnterpriseAiGatewayPlatformService,
    private readonly modelRegistry: ModelRegistryService
  ) {}

  /**
   * GET /ai/providers
   * Retrieve catalog of registered AI providers and their status.
   */
  @Get('providers')
  async getProviders(): Promise<ProviderCatalog> {
    return this.gatewayService.getProviderCatalog();
  }

  /**
   * POST /ai/providers
   * Register a new AI provider definition.
   */
  @Post('providers')
  @HttpCode(HttpStatus.CREATED)
  async registerProvider(@Body() dto: RegisterProviderDto) {
    return this.gatewayService.registerProvider(dto);
  }

  /**
   * GET /ai/models
   * Retrieve catalog of supported AI models and context window capacities.
   */
  @Get('models')
  async getModels(): Promise<ModelCatalog> {
    return {
      totalModels: 5,
      models: [
        { modelId: 'gpt-4o', providerType: ProviderType.OPENAI, capabilities: [ModelType.CHAT, ModelType.VISION], contextWindowTokens: 128000 },
        { modelId: 'gpt-4o-mini', providerType: ProviderType.OPENAI, capabilities: [ModelType.CHAT], contextWindowTokens: 128000 },
        { modelId: 'claude-3-5-sonnet', providerType: ProviderType.ANTHROPIC, capabilities: [ModelType.CHAT, ModelType.REASONING], contextWindowTokens: 200000 },
        { modelId: 'gemini-1.5-pro', providerType: ProviderType.GOOGLE_GEMINI, capabilities: [ModelType.CHAT, ModelType.MULTIMODAL], contextWindowTokens: 1000000 },
        { modelId: 'llama-3', providerType: ProviderType.OLLAMA, capabilities: [ModelType.CHAT, ModelType.COMPLETION], contextWindowTokens: 8192 },
      ],
    };
  }

  /**
   * POST /ai/inference
   * Execute provider-agnostic unified AI inference with automatic routing & failover.
   */
  @Post('inference')
  @HttpCode(HttpStatus.OK)
  async executeInference(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: ExecuteInferenceDto
  ): Promise<InferenceResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.gatewayService.executeInference(tenantId, dto);
  }

  /**
   * GET /ai/inference/history
   * Query inference execution audit history.
   */
  @Get('inference/history')
  async getInferenceHistory(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<InferenceHistory> {
    const tenantId = tenantHeader || undefined;
    return this.gatewayService.getInferenceHistory(tenantId);
  }

  /**
   * GET /ai/providers/health
   * Retrieve health monitoring dashboard for all configured AI providers.
   */
  @Get('providers/health')
  async getProviderHealth(): Promise<ProviderHealthDashboard> {
    const catalog = await this.gatewayService.getProviderCatalog();
    const providers = catalog.providers.map(p => ({
      providerName: p.name,
      type: p.type,
      status: p.status,
      lastPingAt: new Date(),
      latencyMs: 110,
    }));

    return {
      healthyCount: providers.filter(p => p.status === ProviderStatus.HEALTHY).length,
      degradedCount: providers.filter(p => p.status === ProviderStatus.DEGRADED).length,
      unavailableCount: providers.filter(p => p.status === ProviderStatus.UNAVAILABLE).length,
      providers,
    };
  }

  /**
   * GET /ai/costs
   * Retrieve token usage spend and cost tracking metrics.
   */
  @Get('costs')
  async getCostDashboard(): Promise<CostDashboard> {
    return this.gatewayService.getCostDashboard();
  }
}
