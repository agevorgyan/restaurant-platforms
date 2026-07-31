/**
 * Enterprise AI Gateway - Comprehensive Test Suite
 *
 * Tests Value Objects, Multi-Provider Abstraction, Automatic Model Routing,
 * Provider Failover Engine, Token Cost Tracking, and Platform Services.
 */

import {
  InferenceRequest,
  CostEstimate,
  Latency,
  InferenceMetadata,
  InferenceResponse,
} from './domain/value-objects/ai-vo';
import { ProviderType, ModelType, ProviderStatus } from './domain/enums/ai.enums';
import {
  CostLimitExceededException,
  InferenceExecutionException,
} from './domain/exceptions/ai.exceptions';
import { ProviderAggregate } from './domain/models/provider.aggregate';
import {
  InMemoryProviderRepository,
  InMemoryInferenceHistoryRepository,
} from './infrastructure/repositories/in-memory-provider.repository';
import {
  OpenAiProviderAdapter,
  AnthropicProviderAdapter,
  GeminiProviderAdapter,
  OllamaProviderAdapter,
} from './infrastructure/adapters/provider.adapters';
import { NestEventPublisherAdapter } from '../integration/infrastructure/adapters/connector.adapters';
import {
  ProviderRegistryService,
  ModelRegistryService,
  RoutingService,
  CostTrackingService,
  EnterpriseAiGatewayPlatformService,
} from './application/services/ai-gateway.services';

describe('Enterprise AI Gateway Platform', () => {
  describe('Value Objects & Cost Calculations', () => {
    it('should create InferenceRequest and calculate CostEstimate', () => {
      const request = InferenceRequest.create({
        messages: [{ role: 'user', content: 'Suggest menu items for summer' }],
        modelType: ModelType.CHAT,
        temperature: 0.7,
      });

      expect(request.messages.length).toBe(1);
      expect(request.modelType).toBe(ModelType.CHAT);

      const cost = CostEstimate.calculate(1000, 500, 0.0025, 0.01);
      expect(cost.promptCostUsd).toBe(0.0025);
      expect(cost.completionCostUsd).toBe(0.005);
      expect(cost.totalCostUsd).toBe(0.0075);
    });

    it('should create Latency and InferenceMetadata', () => {
      const latency = Latency.create(10, 150);
      expect(latency.queueTimeMs).toBe(10);
      expect(latency.executionTimeMs).toBe(150);
      expect(latency.totalTimeMs).toBe(160);
    });
  });

  describe('ProviderAggregate & Status Machine', () => {
    it('should register provider and check model & capability support', () => {
      const provider = ProviderAggregate.register({
        name: 'OpenAI Primary',
        type: ProviderType.OPENAI,
        supportedModels: ['gpt-4o', 'gpt-4o-mini'],
        supportedCapabilities: [ModelType.CHAT, ModelType.VISION],
        priority: 1,
      });

      expect(provider.getStatus()).toBe(ProviderStatus.HEALTHY);
      expect(provider.supportsModel('gpt-4o')).toBe(true);
      expect(provider.supportsModel('claude-3-5-sonnet')).toBe(false);
      expect(provider.supportsCapability(ModelType.VISION)).toBe(true);

      provider.updateStatus(ProviderStatus.DEGRADED);
      expect(provider.getStatus()).toBe(ProviderStatus.DEGRADED);
    });
  });

  describe('Infrastructure Provider Adapters', () => {
    it('should execute OpenAI inference through OpenAiProviderAdapter', async () => {
      const adapter = new OpenAiProviderAdapter();
      const request = InferenceRequest.create({
        messages: [{ role: 'user', content: 'Generate dish description' }],
      });

      const response = await adapter.executeInference(request, 'gpt-4o');
      expect(response.text).toContain('OpenAI gpt-4o');
      expect(response.metadata.providerType).toBe(ProviderType.OPENAI);
      expect(response.metadata.totalTokens).toBeGreaterThan(0);
    });

    it('should execute Anthropic inference through AnthropicProviderAdapter', async () => {
      const adapter = new AnthropicProviderAdapter();
      const request = InferenceRequest.create({
        messages: [{ role: 'user', content: 'Analyze sales data' }],
      });

      const response = await adapter.executeInference(request, 'claude-3-5-sonnet');
      expect(response.text).toContain('Anthropic claude-3-5-sonnet');
      expect(response.metadata.providerType).toBe(ProviderType.ANTHROPIC);
    });
  });

  describe('Gateway Services & Automatic Provider Failover', () => {
    let providerRepo: InMemoryProviderRepository;
    let historyRepo: InMemoryInferenceHistoryRepository;
    let publisherAdapter: NestEventPublisherAdapter;

    let openaiAdapter: OpenAiProviderAdapter;
    let anthropicAdapter: AnthropicProviderAdapter;
    let geminiAdapter: GeminiProviderAdapter;
    let ollamaAdapter: OllamaProviderAdapter;

    let registryService: ProviderRegistryService;
    let modelRegistryService: ModelRegistryService;
    let routingService: RoutingService;
    let costService: CostTrackingService;
    let gatewayPlatformService: EnterpriseAiGatewayPlatformService;

    beforeEach(async () => {
      providerRepo = new InMemoryProviderRepository();
      historyRepo = new InMemoryInferenceHistoryRepository();
      publisherAdapter = new NestEventPublisherAdapter();

      openaiAdapter = new OpenAiProviderAdapter();
      anthropicAdapter = new AnthropicProviderAdapter();
      geminiAdapter = new GeminiProviderAdapter();
      ollamaAdapter = new OllamaProviderAdapter();

      registryService = new ProviderRegistryService(providerRepo);
      modelRegistryService = new ModelRegistryService();
      routingService = new RoutingService(providerRepo);
      costService = new CostTrackingService();

      const adaptersArray = [openaiAdapter, anthropicAdapter, geminiAdapter, ollamaAdapter];

      gatewayPlatformService = new EnterpriseAiGatewayPlatformService(
        providerRepo,
        historyRepo,
        publisherAdapter,
        adaptersArray,
        routingService,
        costService,
        registryService
      );

      // Seed Providers
      await registryService.registerProvider({
        name: 'OpenAI Primary',
        type: ProviderType.OPENAI,
        supportedModels: ['gpt-4o'],
        priority: 1,
      });

      await registryService.registerProvider({
        name: 'Anthropic Fallback',
        type: ProviderType.ANTHROPIC,
        supportedModels: ['claude-3-5-sonnet'],
        priority: 2,
      });
    });

    it('should successfully route and execute inference on top priority provider', async () => {
      const response = await gatewayPlatformService.executeInference('tenant-ai-1', {
        messages: [{ role: 'user', content: 'What is the top selling pizza?' }],
        targetModelId: 'gpt-4o',
      });

      expect(response.providerType).toBe(ProviderType.OPENAI);
      expect(response.failoverOccurred).toBe(false);
      expect(response.totalTokens).toBeGreaterThan(0);
      expect(response.totalCostUsd).toBeGreaterThan(0);
    });

    it('should automatically failover to secondary provider when primary fails', async () => {
      // Mock OpenAI adapter to simulate failure
      jest.spyOn(openaiAdapter, 'executeInference').mockRejectedValueOnce(new Error('OpenAI API 503 Rate Limit Exceeded'));

      const response = await gatewayPlatformService.executeInference('tenant-ai-1', {
        messages: [{ role: 'user', content: 'Generate promotional menu email' }],
        targetModelId: 'gpt-4o',
      });

      expect(response.failoverOccurred).toBe(true);
      expect(response.providerType).toBe(ProviderType.ANTHROPIC);
      expect(response.text).toContain('Anthropic');
    });

    it('should query provider catalog and cost dashboards', async () => {
      const catalog = await gatewayPlatformService.getProviderCatalog();
      expect(catalog.totalCount).toBe(2);

      const costs = await gatewayPlatformService.getCostDashboard();
      expect(costs).toBeDefined();
    });

    it('should enforce tenant budget limit and throw CostLimitExceededException', () => {
      expect(() => costService.checkBudgetLimit('tenant-exceeded', 0.0)).toThrow(CostLimitExceededException);
    });
  });
});
