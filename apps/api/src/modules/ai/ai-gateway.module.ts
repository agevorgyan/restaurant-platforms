/**
 * Enterprise AI Gateway & Prompt Management Platform Module
 *
 * Registers controllers, domain services, infrastructure repositories,
 * prompt variable engines, and provider adapters (OpenAI, Anthropic, Gemini, Ollama)
 * into NestJS DI container.
 */

import { Module } from '@nestjs/common';
import { EnterpriseAiGatewayController } from './presentation/controllers/enterprise-ai-gateway.controller';
import { EnterprisePromptController } from './presentation/controllers/enterprise-prompt.controller';

// AI Gateway Services & Tokens
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

// Prompt Platform Services & Tokens
import {
  VariableService,
  TemplateService,
  EvaluationService,
  ApprovalService,
  EnterprisePromptPlatformService,
  PROMPT_REPOSITORY_TOKEN,
} from './application/services/prompt-platform.services';

// Repositories
import {
  InMemoryProviderRepository,
  InMemoryInferenceHistoryRepository,
} from './infrastructure/repositories/in-memory-provider.repository';
import { InMemoryPromptRepository } from './infrastructure/repositories/in-memory-prompt.repository';

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
  controllers: [
    EnterpriseAiGatewayController,
    EnterprisePromptController,
  ],
  providers: [
    // AI Gateway Repositories
    {
      provide: PROVIDER_REPOSITORY_TOKEN,
      useClass: InMemoryProviderRepository,
    },
    {
      provide: INFERENCE_HISTORY_REPOSITORY_TOKEN,
      useClass: InMemoryInferenceHistoryRepository,
    },

    // Prompt Platform Repositories
    {
      provide: PROMPT_REPOSITORY_TOKEN,
      useClass: InMemoryPromptRepository,
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

    // AI Gateway Domain Services
    ProviderRegistryService,
    ModelRegistryService,
    RoutingService,
    CostTrackingService,
    EnterpriseAiGatewayPlatformService,

    // Prompt Platform Domain Services
    VariableService,
    TemplateService,
    EvaluationService,
    ApprovalService,
    EnterprisePromptPlatformService,
  ],
  exports: [
    EnterpriseAiGatewayPlatformService,
    ProviderRegistryService,
    ModelRegistryService,
    RoutingService,

    // Prompt Exports
    EnterprisePromptPlatformService,
    VariableService,
    TemplateService,
    EvaluationService,
    ApprovalService,
  ],
})
export class AiGatewayModule {}
