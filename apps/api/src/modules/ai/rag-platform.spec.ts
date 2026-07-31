/**
 * Enterprise RAG Platform - Comprehensive Test Suite
 *
 * Tests Candidate Chunk Retrieval, Reciprocal Rank Fusion (RRF) Re-ranking, Context Budget Compression,
 * Citation Generation, Grounding Verification, and End-to-End Grounded Answer Synthesis.
 */

import { ContextBudget, GroundingScore, Citation } from './domain/value-objects/rag-vo';
import { RetrievalType, ContextType, RankingStrategy, RetrievalStatus } from './domain/enums/rag.enums';
import { RagSessionAggregate } from './domain/models/rag-session.aggregate';
import { InMemoryRagRepository } from './infrastructure/repositories/in-memory-rag.repository';
import { InMemoryEmbeddingRepository } from './infrastructure/repositories/in-memory-embedding.repository';
import { InMemoryVectorStoreAdapter } from './infrastructure/repositories/pgvector-store.adapter';
import { InMemoryProviderRepository, InMemoryInferenceHistoryRepository } from './infrastructure/repositories/in-memory-provider.repository';
import { OpenAiProviderAdapter, AnthropicProviderAdapter } from './infrastructure/adapters/provider.adapters';
import { NestEventPublisherAdapter } from '../integration/infrastructure/adapters/connector.adapters';
import {
  RetrievalService,
  RerankingService,
  ContextAssemblerService,
  GroundingService,
  EnterpriseRagPlatformService,
} from './application/services/rag-platform.services';
import { EnterpriseVectorPlatformService, ChunkingService, EmbeddingService } from './application/services/vector-platform.services';
import { EnterpriseAiGatewayPlatformService, ProviderRegistryService, RoutingService, CostTrackingService } from './application/services/ai-gateway.services';
import { ProviderType } from './domain/enums/ai.enums';
import { CollectionType } from './domain/enums/vector.enums';

describe('Enterprise RAG Platform', () => {
  describe('Value Objects & Grounding Calculations', () => {
    it('should create ContextBudget and calculate character limits', () => {
      const budget = ContextBudget.create(2000);
      expect(budget.maxTokens).toBe(2000);
      expect(budget.maxChars).toBe(8000);
    });

    it('should calculate GroundingScore and check sufficiency threshold', () => {
      const groundingPass = GroundingScore.calculate(85.0, 60.0);
      expect(groundingPass.percentage).toBe(85.0);
      expect(groundingPass.isGroundingSufficient).toBe(true);

      const groundingFail = GroundingScore.calculate(40.0, 60.0);
      expect(groundingFail.isGroundingSufficient).toBe(false);
    });
  });

  describe('RagSessionAggregate & State Machine', () => {
    it('should advance RAG session aggregate through retrieval pipeline states', () => {
      const session = RagSessionAggregate.create({
        queryText: 'What is the recipe for Truffle Risotto?',
        retrievalType: RetrievalType.HYBRID_SEARCH,
      });

      expect(session.getStatus()).toBe(RetrievalStatus.QUEUED);

      session.recordChunksRetrieved([]);
      expect(session.getStatus()).toBe(RetrievalStatus.RETRIEVING);

      session.recordRankedContext([]);
      expect(session.getStatus()).toBe(RetrievalStatus.RANKING);

      const grounding = GroundingScore.calculate(90.0);
      session.completeSession('Use arborio rice, truffle oil, and parmesan cheese.', [], grounding);

      expect(session.getStatus()).toBe(RetrievalStatus.COMPLETED);
      expect(session.getGeneratedAnswer()).toContain('arborio rice');
    });
  });

  describe('RAG Pipeline & End-to-End Query Execution', () => {
    let ragRepo: InMemoryRagRepository;
    let vectorRepo: InMemoryEmbeddingRepository;
    let vectorStore: InMemoryVectorStoreAdapter;
    let providerRepo: InMemoryProviderRepository;
    let historyRepo: InMemoryInferenceHistoryRepository;
    let publisherAdapter: NestEventPublisherAdapter;

    let chunkingService: ChunkingService;
    let embeddingService: EmbeddingService;
    let vectorPlatform: EnterpriseVectorPlatformService;

    let openaiAdapter: OpenAiProviderAdapter;
    let anthropicAdapter: AnthropicProviderAdapter;
    let registryService: ProviderRegistryService;
    let routingService: RoutingService;
    let costService: CostTrackingService;
    let aiGateway: EnterpriseAiGatewayPlatformService;

    let retrievalService: RetrievalService;
    let rerankingService: RerankingService;
    let contextAssembler: ContextAssemblerService;
    let groundingService: GroundingService;
    let ragPlatformService: EnterpriseRagPlatformService;

    beforeEach(async () => {
      ragRepo = new InMemoryRagRepository();
      vectorRepo = new InMemoryEmbeddingRepository();
      vectorStore = new InMemoryVectorStoreAdapter();
      providerRepo = new InMemoryProviderRepository();
      historyRepo = new InMemoryInferenceHistoryRepository();
      publisherAdapter = new NestEventPublisherAdapter();

      chunkingService = new ChunkingService();
      embeddingService = new EmbeddingService();
      vectorPlatform = new EnterpriseVectorPlatformService(vectorRepo, vectorStore, publisherAdapter, chunkingService, embeddingService);

      openaiAdapter = new OpenAiProviderAdapter();
      anthropicAdapter = new AnthropicProviderAdapter();
      registryService = new ProviderRegistryService(providerRepo);
      routingService = new RoutingService(providerRepo);
      costService = new CostTrackingService();

      aiGateway = new EnterpriseAiGatewayPlatformService(
        providerRepo,
        historyRepo,
        publisherAdapter,
        [openaiAdapter, anthropicAdapter],
        routingService,
        costService,
        registryService
      );

      // Seed AI Provider
      await registryService.registerProvider({
        name: 'OpenAI Primary',
        type: ProviderType.OPENAI,
        supportedModels: ['gpt-4o'],
        priority: 1,
      });

      retrievalService = new RetrievalService(vectorPlatform);
      rerankingService = new RerankingService();
      contextAssembler = new ContextAssemblerService();
      groundingService = new GroundingService();

      ragPlatformService = new EnterpriseRagPlatformService(
        ragRepo,
        rerankingService,
        publisherAdapter,
        retrievalService,
        contextAssembler,
        groundingService,
        aiGateway
      );
    });

    it('should retrieve context, assemble prompt budget, execute grounded query, and generate citations', async () => {
      // 1. Seed Vector Collection & Document Embeddings
      const collection = await vectorPlatform.createCollection('tenant-rag-1', {
        name: 'Restaurant Operations Manual',
        description: 'Standard operating procedures for kitchen staff',
        type: CollectionType.KNOWLEDGE_BASE,
      });

      await vectorPlatform.generateAndIndexEmbedding('tenant-rag-1', {
        collectionId: collection.getId().getValue(),
        text: 'Food Safety Policy: All raw poultry must be stored at or below 41°F (5°C) in bottom refrigerator drawers to prevent cross-contamination.',
      });

      // 2. Execute RAG Query
      const ragResponse = await ragPlatformService.executeRagQuery('tenant-rag-1', {
        queryText: 'What is the required storage temperature for raw poultry?',
        collectionIds: [collection.getId().getValue()],
        retrievalType: RetrievalType.HYBRID_SEARCH,
        maxBudgetTokens: 2000,
      });

      expect(ragResponse.sessionId).toBeDefined();
      expect(ragResponse.answerText).toBeDefined();
      expect(ragResponse.citations.length).toBeGreaterThan(0);
      expect(ragResponse.groundingPercentage).toBeGreaterThanOrEqual(0);

      // 3. Query RAG Analytics Read Models
      const history = await ragPlatformService.getRetrievalHistory('tenant-rag-1');
      expect(history.totalQueries).toBe(1);

      const stats = await ragPlatformService.getContextStatistics();
      expect(stats.totalChunksAssembled).toBeGreaterThan(0);

      const citations = await ragPlatformService.getCitationHistory();
      expect(citations.totalCitations).toBeGreaterThan(0);
    });
  });
});
