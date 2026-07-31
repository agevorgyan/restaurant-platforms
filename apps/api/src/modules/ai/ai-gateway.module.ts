/**
 * Enterprise AI Gateway Module
 *
 * Registers controllers, domain services, infrastructure repositories,
 * and provider adapters (OpenAI, Anthropic, Gemini, Ollama) into NestJS DI container.
 */

import { Module } from '@nestjs/common';
import { EnterpriseAiGatewayController } from './presentation/controllers/enterprise-ai-gateway.controller';

// Services & Tokens
import {
  ProviderRegistryService,
  ModelRegistryService,
  RoutingService,
  CostTrackingService,
  EnterpriseAiGatewayPlatformService,
  PROVIDER_REPOSITORY_TOKEN,
  INFERENCE_HISTORY_REPOSITORY_TOKEN,
  PROVIDER_ADAPTERS_TOKEN,
} from './application/services/ai-gateway.services';

// Repositories
import {
  InMemoryProviderRepository,
  InMemoryInferenceHistoryRepository,
} from './infrastructure/repositories/in-memory-provider.repository';

// Infrastructure Adapters
import {
  OpenAiProviderAdapter,
  AnthropicProviderAdapter,
  GeminiProviderAdapter,
  OllamaProviderAdapter,
} from './infrastructure/adapters/provider.adapters';

// Integration Module for Event Publisher
import { IntegrationModule } from '../integration/integration.module';

@Module({
  imports: [IntegrationModule],
  controllers: [EnterpriseAiGatewayController],
  providers: [
    // Repositories
    {
      provide: PROVIDER_REPOSITORY_TOKEN,
      useClass: InMemoryProviderRepository,
    },
    {
      provide: INFERENCE_HISTORY_REPOSITORY_TOKEN,
      useClass: InMemoryInferenceHistoryRepository,
    },

    // Provider Adapters
    OpenAiProviderAdapter,
    AnthropicProviderAdapter,
    GeminiProviderAdapter,
    OllamaProviderAdapter,
    {
      provide: PROVIDER_ADAPTERS_TOKEN,
      useFactory: (openai, anthropic, gemini, ollama) => [openai, anthropic, gemini, ollama],
      inject: [OpenAiProviderAdapter, AnthropicProviderAdapter, GeminiProviderAdapter, OllamaProviderAdapter],
    },

    // Domain Services
    ProviderRegistryService,
    ModelRegistryService,
    RoutingService,
    CostTrackingService,
    EnterpriseAiGatewayPlatformService,
  ],
  exports: [
    EnterpriseAiGatewayPlatformService,
    ProviderRegistryService,
    ModelRegistryService,
    RoutingService,
  ],
})
export class AiGatewayModule {}
