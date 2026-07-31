/**
 * Enterprise AI Gateway, Prompt Platform, Embedding/Vector Platform & RAG Platform Module
 *
 * Registers controllers, domain services, infrastructure repositories,
 * vector store adapters (pgvector / in-memory), RAG context assemblers,
 * and AI provider adapters into NestJS DI container.
 */

import { Module } from '@nestjs/common';
import { EnterpriseAiGatewayController } from './presentation/controllers/enterprise-ai-gateway.controller';
import { EnterprisePromptController } from './presentation/controllers/enterprise-prompt.controller';
import { EnterpriseVectorController } from './presentation/controllers/enterprise-vector.controller';
import { EnterpriseRagController } from './presentation/controllers/enterprise-rag.controller';

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

// Vector Platform Services & Tokens
import {
  ChunkingService,
  EmbeddingService,
  EnterpriseVectorPlatformService,
  EMBEDDING_REPOSITORY_TOKEN,
  VECTOR_STORE_TOKEN,
} from './application/services/vector-platform.services';

// RAG Platform Services & Tokens
import {
  RetrievalService,
  RerankingService,
  ContextAssemblerService,
  GroundingService,
  EnterpriseRagPlatformService,
  RAG_REPOSITORY_TOKEN,
  RERANKER_TOKEN,
} from './application/services/rag-platform.services';

// Repositories & Adapters
import {
  InMemoryProviderRepository,
  InMemoryInferenceHistoryRepository,
} from './infrastructure/repositories/in-memory-provider.repository';
import { InMemoryPromptRepository } from './infrastructure/repositories/in-memory-prompt.repository';
import { InMemoryEmbeddingRepository } from './infrastructure/repositories/in-memory-embedding.repository';
import { InMemoryVectorStoreAdapter, PgVectorStoreAdapter } from './infrastructure/repositories/pgvector-store.adapter';
import { InMemoryRagRepository } from './infrastructure/repositories/in-memory-rag.repository';

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
    EnterpriseVectorController,
    EnterpriseRagController,
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

    // Vector Platform Repositories & Adapters
    {
      provide: EMBEDDING_REPOSITORY_TOKEN,
      useClass: InMemoryEmbeddingRepository,
    },
    {
      provide: VECTOR_STORE_TOKEN,
      useClass: InMemoryVectorStoreAdapter,
    },
    PgVectorStoreAdapter,

    // RAG Platform Repositories & Adapters
    {
      provide: RAG_REPOSITORY_TOKEN,
      useClass: InMemoryRagRepository,
    },
    {
      provide: RERANKER_TOKEN,
      useClass: RerankingService,
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

    // Vector Platform Domain Services
    ChunkingService,
    EmbeddingService,
    EnterpriseVectorPlatformService,

    // RAG Platform Domain Services
    RetrievalService,
    RerankingService,
    ContextAssemblerService,
    GroundingService,
    EnterpriseRagPlatformService,
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

    // Vector Exports
    EnterpriseVectorPlatformService,
    ChunkingService,
    EmbeddingService,
    VECTOR_STORE_TOKEN,

    // RAG Exports
    EnterpriseRagPlatformService,
    RetrievalService,
    RerankingService,
    ContextAssemblerService,
    GroundingService,
  ],
})
export class AiGatewayModule {}
