/**
 * Enterprise AI Gateway - Application DTOs
 */

import { ProviderType, ModelType, ProviderStatus, InferenceStatus } from '../../domain/enums/ai.enums';

export interface RegisterProviderDto {
  name: string;
  type: ProviderType;
  supportedModels?: string[];
  supportedCapabilities?: ModelType[];
  priority?: number;
  credentialArn?: string;
}

export interface ChatMessageDto {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ExecuteInferenceDto {
  messages: ChatMessageDto[];
  modelType?: ModelType;
  targetModelId?: string;
  temperature?: number;
  maxTokens?: number;
  preferredProvider?: ProviderType;
}

export interface ProviderQueryDto {
  tenantId?: string;
  status?: ProviderStatus;
}

export interface InferenceResponseDto {
  jobId: string;
  status: InferenceStatus;
  providerType: ProviderType;
  modelId: string;
  text: string;
  finishReason: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  totalCostUsd: number;
  durationMs: number;
  failoverOccurred: boolean;
  executedAt: Date;
}
