/**
 * Enterprise AI Gateway - Domain & Application Services
 *
 * Implements core application services:
 * 1. ProviderRegistryService
 * 2. ModelRegistryService
 * 3. RoutingService
 * 4. CapabilityService
 * 5. FailoverService
 * 6. CostTrackingService
 * 7. HealthMonitoringService
 * 8. GatewayService & EnterpriseAiGatewayPlatformService
 */

import { Injectable, Inject, Logger } from '@nestjs/common';
import { ProviderAggregate } from '../../domain/models/provider.aggregate';
import { InferenceJobAggregate } from '../../domain/models/inference-job.aggregate';
import {
  ProviderId,
  InferenceRequest,
  InferenceResponse,
  CostEstimate,
} from '../../domain/value-objects/ai-vo';
import { ProviderType, ModelType, ProviderStatus } from '../../domain/enums/ai.enums';
import {
  ProviderRepositoryPort,
  InferenceHistoryRepositoryPort,
  ProviderAdapterPort,
} from '../../domain/ports/ai.ports';
import { EVENT_PUBLISHER_TOKEN } from '../../../integration/application/services/connector-platform.services';
import { EventPublisherPort } from '../../../integration/domain/ports/connector.ports';
import {
  RegisterProviderDto,
  ExecuteInferenceDto,
  InferenceResponseDto,
  ProviderQueryDto,
} from '../dto/ai.dto';
import {
  ProviderCatalog,
  ModelCatalog,
  ProviderHealthDashboard,
  InferenceHistory,
  CostDashboard,
} from '../read-models/ai.read-models';
import {
  ProviderUnavailableException,
  ModelNotFoundException,
  CostLimitExceededException,
  InferenceExecutionException,
} from '../../domain/exceptions/ai.exceptions';
import { CostThresholdExceededEvent } from '../../domain/events/ai.events';

export const PROVIDER_REPOSITORY_TOKEN = 'ProviderRepositoryPort';
export const INFERENCE_HISTORY_REPOSITORY_TOKEN = 'InferenceHistoryRepositoryPort';
export const PROVIDER_ADAPTERS_TOKEN = 'ProviderAdaptersToken';

/**
 * Service 1: ProviderRegistryService
 * Registers and configures AI providers and credentials.
 */
@Injectable()
export class ProviderRegistryService {
  constructor(
    @Inject(PROVIDER_REPOSITORY_TOKEN)
    private readonly repo: ProviderRepositoryPort
  ) {}

  public async registerProvider(dto: RegisterProviderDto): Promise<ProviderAggregate> {
    const aggregate = ProviderAggregate.register({
      name: dto.name,
      type: dto.type,
      supportedModels: dto.supportedModels,
      supportedCapabilities: dto.supportedCapabilities,
      priority: dto.priority,
      credentialArn: dto.credentialArn,
    });

    await this.repo.save(aggregate);
    return aggregate;
  }
}

/**
 * Service 2: ModelRegistryService
 * Maintained catalog of AI models and their capabilities.
 */
@Injectable()
export class ModelRegistryService {
  private static readonly MODEL_CATALOG_MAP: Record<string, { provider: ProviderType; capabilities: ModelType[]; contextWindow: number }> = {
    'gpt-4o': { provider: ProviderType.OPENAI, capabilities: [ModelType.CHAT, ModelType.VISION, ModelType.FUNCTION_CALLING], contextWindow: 128000 },
    'gpt-4o-mini': { provider: ProviderType.OPENAI, capabilities: [ModelType.CHAT, ModelType.FUNCTION_CALLING], contextWindow: 128000 },
    'claude-3-5-sonnet': { provider: ProviderType.ANTHROPIC, capabilities: [ModelType.CHAT, ModelType.REASONING, ModelType.VISION], contextWindow: 200000 },
    'gemini-1.5-pro': { provider: ProviderType.GOOGLE_GEMINI, capabilities: [ModelType.CHAT, ModelType.MULTIMODAL, ModelType.VISION], contextWindow: 1000000 },
    'llama-3': { provider: ProviderType.OLLAMA, capabilities: [ModelType.CHAT, ModelType.COMPLETION], contextWindow: 8192 },
  };

  public getModelDetails(modelId: string) {
    return ModelRegistryService.MODEL_CATALOG_MAP[modelId] || {
      provider: ProviderType.OPENAI,
      capabilities: [ModelType.CHAT],
      contextWindow: 32768,
    };
  }
}

/**
 * Service 3: RoutingService
 * Selects optimal healthy AI provider based on model capability & priority.
 */
@Injectable()
export class RoutingService {
  constructor(
    @Inject(PROVIDER_REPOSITORY_TOKEN)
    private readonly repo: ProviderRepositoryPort
  ) {}

  public async selectProvider(request: InferenceRequest): Promise<{ provider: ProviderAggregate; targetModel: string }> {
    const providers = await this.repo.findAll();
    const healthyProviders = providers
      .filter(p => p.getStatus() === ProviderStatus.HEALTHY || p.getStatus() === ProviderStatus.DEGRADED)
      .sort((a, b) => a.getPriority() - b.getPriority());

    if (healthyProviders.length === 0) {
      throw new ProviderUnavailableException('All AI Providers', 'No healthy or degraded AI provider available.');
    }

    // 1. If explicit target model requested
    if (request.targetModelId) {
      const match = healthyProviders.find(p => p.supportsModel(request.targetModelId!));
      if (match) {
        return { provider: match, targetModel: request.targetModelId };
      }
    }

    // 2. Select by requested capability
    const capabilityMatch = healthyProviders.find(p => p.supportsCapability(request.modelType));
    if (capabilityMatch) {
      const targetModel = request.targetModelId || capabilityMatch.getSupportedModels()[0]?.getValue() || 'gpt-4o';
      return { provider: capabilityMatch, targetModel };
    }

    // 3. Fallback to top priority healthy provider
    const fallback = healthyProviders[0];
    const defaultModel = request.targetModelId || fallback.getSupportedModels()[0]?.getValue() || 'gpt-4o';
    return { provider: fallback, targetModel: defaultModel };
  }
}

/**
 * Service 4: CostTrackingService
 * Evaluates token usage costs and enforces tenant budget policies.
 */
@Injectable()
export class CostTrackingService {
  private static readonly TENANT_SPEND_MAP = new Map<string, number>();

  public checkBudgetLimit(tenantId: string, maxLimitUsd: number = 500.0): void {
    const currentSpend = CostTrackingService.TENANT_SPEND_MAP.get(tenantId) || 0;
    if (currentSpend >= maxLimitUsd) {
      throw new CostLimitExceededException(tenantId, currentSpend, maxLimitUsd);
    }
  }

  public recordCost(tenantId: string, costUsd: number): number {
    const prev = CostTrackingService.TENANT_SPEND_MAP.get(tenantId) || 0;
    const updated = prev + costUsd;
    CostTrackingService.TENANT_SPEND_MAP.set(tenantId, updated);
    return updated;
  }
}

/**
 * Service 5 & 6: FailoverService & GatewayService
 * Manages runtime provider failover and unifies inference execution across provider adapters.
 */
@Injectable()
export class EnterpriseAiGatewayPlatformService {
  private readonly logger = new Logger(EnterpriseAiGatewayPlatformService.name);
  private readonly adaptersMap = new Map<ProviderType, ProviderAdapterPort>();

  constructor(
    @Inject(PROVIDER_REPOSITORY_TOKEN)
    private readonly providerRepo: ProviderRepositoryPort,
    @Inject(INFERENCE_HISTORY_REPOSITORY_TOKEN)
    private readonly historyRepo: InferenceHistoryRepositoryPort,
    @Inject(EVENT_PUBLISHER_TOKEN)
    private readonly eventPublisher: EventPublisherPort,
    @Inject(PROVIDER_ADAPTERS_TOKEN)
    adapters: ProviderAdapterPort[],
    private readonly routingService: RoutingService,
    private readonly costService: CostTrackingService,
    private readonly registryService: ProviderRegistryService
  ) {
    for (const adapter of adapters) {
      this.adaptersMap.set(adapter.getProviderType(), adapter);
    }
  }

  public async registerProvider(dto: RegisterProviderDto): Promise<ProviderAggregate> {
    const aggregate = await this.registryService.registerProvider(dto);
    await this.eventPublisher.publishAll(aggregate.getUncommittedEvents());
    aggregate.clearEvents();
    return aggregate;
  }

  public async executeInference(tenantId: string, dto: ExecuteInferenceDto): Promise<InferenceResponseDto> {
    // 1. Check Tenant Budget Limit
    this.costService.checkBudgetLimit(tenantId);

    const request = InferenceRequest.create({
      messages: dto.messages,
      modelType: dto.modelType,
      targetModelId: dto.targetModelId,
      temperature: dto.temperature,
      maxTokens: dto.maxTokens,
    });

    // 2. Select Optimal Provider
    const { provider: primaryProvider, targetModel } = await this.routingService.selectProvider(request);
    const job = InferenceJobAggregate.create({
      tenantId,
      request,
      primaryProvider: primaryProvider.getType(),
    });

    job.markRunning(primaryProvider.getType());
    await this.eventPublisher.publishAll(job.getUncommittedEvents());
    job.clearEvents();

    let response: InferenceResponse | null = null;
    let actualProviderType = primaryProvider.getType();

    // 3. Execute with Automatic Provider Failover
    try {
      const adapter = this.getAdapter(primaryProvider.getType());
      response = await adapter.executeInference(request, targetModel);
    } catch (primaryErr: any) {
      this.logger.warn(`Primary AI Provider '${primaryProvider.getType()}' failed: ${primaryErr?.message}. Initiating failover...`);

      // Find secondary fallback provider
      const allProviders = await this.providerRepo.findAll();
      const fallback = allProviders.find(p => p.getType() !== primaryProvider.getType() && p.getStatus() === ProviderStatus.HEALTHY);

      if (!fallback) {
        job.markFailed(`Primary provider failed (${primaryErr?.message}) and no healthy fallback available.`);
        await this.historyRepo.saveJob(job);
        await this.eventPublisher.publishAll(job.getUncommittedEvents());
        job.clearEvents();
        throw new InferenceExecutionException(job.getErrorReason()!);
      }

      actualProviderType = fallback.getType();
      job.recordFailover(fallback.getType(), primaryErr?.message || 'Primary provider error');
      await this.eventPublisher.publishAll(job.getUncommittedEvents());
      job.clearEvents();

      try {
        const fallbackAdapter = this.getAdapter(fallback.getType());
        const fallbackModel = fallback.getSupportedModels()[0]?.getValue() || 'claude-3-5-sonnet';
        response = await fallbackAdapter.executeInference(request, fallbackModel);
      } catch (fallbackErr: any) {
        job.markFailed(`Both primary '${primaryProvider.getType()}' and fallback '${fallback.getType()}' failed.`);
        await this.historyRepo.saveJob(job);
        await this.eventPublisher.publishAll(job.getUncommittedEvents());
        job.clearEvents();
        throw new InferenceExecutionException(job.getErrorReason()!);
      }
    }

    // 4. Record Cost & Complete Job
    const updatedTenantSpend = this.costService.recordCost(tenantId, response.metadata.cost.totalCostUsd);
    if (updatedTenantSpend > 450.0) {
      await this.eventPublisher.publish(
        new CostThresholdExceededEvent(job.getId(), tenantId, updatedTenantSpend, 500.0)
      );
    }

    job.markCompleted(response);
    await this.historyRepo.saveJob(job);
    await this.eventPublisher.publishAll(job.getUncommittedEvents());
    job.clearEvents();

    return this.toResponseDto(job);
  }

  public async getProviderCatalog(): Promise<ProviderCatalog> {
    const list = await this.providerRepo.findAll();
    const providers = list.map(p => ({
      id: p.getId().getValue(),
      name: p.getName().getValue(),
      type: p.getType(),
      status: p.getStatus(),
      priority: p.getPriority(),
      models: p.getSupportedModels().map(m => m.getValue()),
      capabilities: p.getSupportedCapabilities(),
    }));

    return {
      totalCount: providers.length,
      providers,
    };
  }

  public async getInferenceHistory(tenantId?: string): Promise<InferenceHistory> {
    const list = await this.historyRepo.findHistory(tenantId, 100);
    const history = list.map(j => {
      const resp = j.getResponse();
      const meta = resp?.metadata;
      return {
        jobId: j.getId(),
        tenantId: j.getTenantId(),
        providerType: j.getActualProvider() || j.getPrimaryProvider(),
        modelId: meta?.modelId || 'unknown',
        status: j.getStatus(),
        totalTokens: meta?.totalTokens || 0,
        totalCostUsd: meta?.cost.totalCostUsd || 0,
        durationMs: meta?.latency.totalTimeMs || 0,
        failoverOccurred: j.isFailoverOccurred(),
        timestamp: j.getUpdatedAt(),
      };
    });

    return {
      totalJobsCount: history.length,
      history,
    };
  }

  public async getCostDashboard(): Promise<CostDashboard> {
    const list = await this.historyRepo.findHistory(undefined, 1000);
    let totalCost = 0;
    let totalTokens = 0;
    const costByProvider: Record<ProviderType, number> = {} as any;
    for (const t of Object.values(ProviderType)) costByProvider[t] = 0;

    for (const job of list) {
      const meta = job.getResponse()?.metadata;
      if (meta) {
        totalCost += meta.cost.totalCostUsd;
        totalTokens += meta.totalTokens;
        costByProvider[meta.providerType] = (costByProvider[meta.providerType] || 0) + meta.cost.totalCostUsd;
      }
    }

    return {
      totalTokensUsed: totalTokens,
      totalCostUsd: totalCost,
      costByProvider,
      costByTenant: {},
    };
  }

  private getAdapter(type: ProviderType): ProviderAdapterPort {
    const adapter = this.adaptersMap.get(type);
    if (!adapter) {
      throw new ProviderUnavailableException(type, `Adapter for provider type '${type}' is not registered.`);
    }
    return adapter;
  }

  private toResponseDto(job: InferenceJobAggregate): InferenceResponseDto {
    const resp = job.getResponse()!;
    const meta = resp.metadata;

    return {
      jobId: job.getId(),
      status: job.getStatus(),
      providerType: meta.providerType,
      modelId: meta.modelId,
      text: resp.text,
      finishReason: resp.finishReason,
      promptTokens: meta.promptTokens,
      completionTokens: meta.completionTokens,
      totalTokens: meta.totalTokens,
      totalCostUsd: meta.cost.totalCostUsd,
      durationMs: meta.latency.totalTimeMs,
      failoverOccurred: job.isFailoverOccurred(),
      executedAt: job.getUpdatedAt(),
    };
  }
}
