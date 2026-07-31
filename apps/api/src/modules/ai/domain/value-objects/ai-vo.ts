/**
 * Enterprise AI Gateway - Domain Value Objects
 */

import { randomUUID } from 'crypto';
import { ModelType, ProviderType } from '../enums/ai.enums';
import { AiDomainException } from '../exceptions/ai.exceptions';

export class ProviderId {
  private constructor(private readonly value: string) {}

  public static create(value: string): ProviderId {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new AiDomainException('ProviderId cannot be empty');
    }
    return new ProviderId(value.trim());
  }

  public static generate(): ProviderId {
    return new ProviderId(randomUUID());
  }

  public getValue(): string {
    return this.value;
  }
}

export class ProviderName {
  private constructor(private readonly value: string) {}

  public static create(value: string): ProviderName {
    const trimmed = value?.trim();
    if (!trimmed) throw new AiDomainException('ProviderName cannot be empty');
    return new ProviderName(trimmed);
  }

  public getValue(): string {
    return this.value;
  }
}

export class ModelId {
  private constructor(private readonly value: string) {}

  public static create(value: string): ModelId {
    const trimmed = value?.trim();
    if (!trimmed) throw new AiDomainException('ModelId cannot be empty');
    return new ModelId(trimmed);
  }

  public getValue(): string {
    return this.value;
  }
}

export class ModelVersion {
  private constructor(private readonly value: string) {}

  public static create(versionStr: string = '1.0.0'): ModelVersion {
    return new ModelVersion(versionStr.trim());
  }

  public getValue(): string {
    return this.value;
  }
}

export class ModelContextWindow {
  private constructor(public readonly tokens: number) {}

  public static create(tokens: number = 128000): ModelContextWindow {
    const clamped = Math.max(1024, tokens);
    return new ModelContextWindow(clamped);
  }
}

export class TokenLimit {
  private constructor(public readonly maxCompletionTokens: number) {}

  public static create(maxTokens: number = 4096): TokenLimit {
    return new TokenLimit(Math.max(128, maxTokens));
  }
}

export class CostEstimate {
  constructor(
    public readonly promptCostUsd: number,
    public readonly completionCostUsd: number,
    public readonly totalCostUsd: number
  ) {}

  public static calculate(promptTokens: number, completionTokens: number, promptRatePerK: number = 0.0025, completionRatePerK: number = 0.01): CostEstimate {
    const pCost = (promptTokens / 1000) * promptRatePerK;
    const cCost = (completionTokens / 1000) * completionRatePerK;
    return new CostEstimate(pCost, cCost, pCost + cCost);
  }
}

export class Latency {
  constructor(
    public readonly queueTimeMs: number,
    public readonly executionTimeMs: number,
    public readonly totalTimeMs: number
  ) {}

  public static create(queueMs: number, executionMs: number): Latency {
    return new Latency(queueMs, executionMs, queueMs + executionMs);
  }
}

export class InferenceMetadata {
  constructor(
    public readonly providerType: ProviderType,
    public readonly modelId: string,
    public readonly promptTokens: number,
    public readonly completionTokens: number,
    public readonly totalTokens: number,
    public readonly cost: CostEstimate,
    public readonly latency: Latency,
    public readonly failoverOccurred: boolean = false
  ) {}

  public static create(params: {
    providerType: ProviderType;
    modelId: string;
    promptTokens: number;
    completionTokens: number;
    cost: CostEstimate;
    latency: Latency;
    failoverOccurred?: boolean;
  }): InferenceMetadata {
    return new InferenceMetadata(
      params.providerType,
      params.modelId,
      params.promptTokens,
      params.completionTokens,
      params.promptTokens + params.completionTokens,
      params.cost,
      params.latency,
      params.failoverOccurred || false
    );
  }
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class InferenceRequest {
  constructor(
    public readonly messages: ChatMessage[],
    public readonly modelType: ModelType = ModelType.CHAT,
    public readonly targetModelId?: string,
    public readonly temperature: number = 0.7,
    public readonly maxTokens: number = 2048,
    public readonly stopSequences?: string[]
  ) {}

  public static create(params: {
    messages: ChatMessage[];
    modelType?: ModelType;
    targetModelId?: string;
    temperature?: number;
    maxTokens?: number;
    stopSequences?: string[];
  }): InferenceRequest {
    if (!params.messages || params.messages.length === 0) {
      throw new AiDomainException('InferenceRequest must contain at least one message');
    }
    return new InferenceRequest(
      params.messages,
      params.modelType || ModelType.CHAT,
      params.targetModelId,
      params.temperature ?? 0.7,
      params.maxTokens ?? 2048,
      params.stopSequences
    );
  }
}

export class InferenceResponse {
  constructor(
    public readonly text: string,
    public readonly finishReason: string,
    public readonly metadata: InferenceMetadata
  ) {}

  public static create(text: string, finishReason: string, metadata: InferenceMetadata): InferenceResponse {
    return new InferenceResponse(text, finishReason, metadata);
  }
}
