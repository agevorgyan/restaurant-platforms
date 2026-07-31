/**
 * Enterprise AI Gateway - Infrastructure Provider Adapters
 *
 * Encapsulates vendor provider logic (OpenAI, Anthropic, Gemini, Ollama)
 * strictly inside infrastructure adapters.
 */

import { Injectable, Logger } from '@nestjs/common';
import { ProviderAdapterPort } from '../../domain/ports/ai.ports';
import { ProviderType } from '../../domain/enums/ai.enums';
import {
  InferenceRequest,
  InferenceResponse,
  InferenceMetadata,
  CostEstimate,
  Latency,
} from '../../domain/value-objects/ai-vo';

@Injectable()
export class OpenAiProviderAdapter implements ProviderAdapterPort {
  private readonly logger = new Logger(OpenAiProviderAdapter.name);

  public getProviderType(): ProviderType {
    return ProviderType.OPENAI;
  }

  public async executeInference(request: InferenceRequest, modelId: string): Promise<InferenceResponse> {
    const startTime = Date.now();
    const promptText = request.messages.map(m => m.content).join(' ');
    
    // Simulate inference execution
    const responseText = `[OpenAI ${modelId}] Mapped response for prompt: "${request.messages[request.messages.length - 1]?.content}"`;
    const executionMs = 120;

    const promptTokens = Math.ceil(promptText.length / 4);
    const completionTokens = Math.ceil(responseText.length / 4);
    const cost = CostEstimate.calculate(promptTokens, completionTokens, 0.0025, 0.01);
    const latency = Latency.create(5, executionMs);

    const metadata = InferenceMetadata.create({
      providerType: ProviderType.OPENAI,
      modelId: modelId || 'gpt-4o',
      promptTokens,
      completionTokens,
      cost,
      latency,
    });

    return InferenceResponse.create(responseText, 'stop', metadata);
  }
}

@Injectable()
export class AnthropicProviderAdapter implements ProviderAdapterPort {
  private readonly logger = new Logger(AnthropicProviderAdapter.name);

  public getProviderType(): ProviderType {
    return ProviderType.ANTHROPIC;
  }

  public async executeInference(request: InferenceRequest, modelId: string): Promise<InferenceResponse> {
    const startTime = Date.now();
    const promptText = request.messages.map(m => m.content).join(' ');
    
    const responseText = `[Anthropic ${modelId}] Claude response for prompt: "${request.messages[request.messages.length - 1]?.content}"`;
    const executionMs = 140;

    const promptTokens = Math.ceil(promptText.length / 4);
    const completionTokens = Math.ceil(responseText.length / 4);
    const cost = CostEstimate.calculate(promptTokens, completionTokens, 0.003, 0.015);
    const latency = Latency.create(8, executionMs);

    const metadata = InferenceMetadata.create({
      providerType: ProviderType.ANTHROPIC,
      modelId: modelId || 'claude-3-5-sonnet',
      promptTokens,
      completionTokens,
      cost,
      latency,
    });

    return InferenceResponse.create(responseText, 'end_turn', metadata);
  }
}

@Injectable()
export class GeminiProviderAdapter implements ProviderAdapterPort {
  private readonly logger = new Logger(GeminiProviderAdapter.name);

  public getProviderType(): ProviderType {
    return ProviderType.GOOGLE_GEMINI;
  }

  public async executeInference(request: InferenceRequest, modelId: string): Promise<InferenceResponse> {
    const startTime = Date.now();
    const promptText = request.messages.map(m => m.content).join(' ');

    const responseText = `[Google Gemini ${modelId}] Gemini multimodal response for prompt: "${request.messages[request.messages.length - 1]?.content}"`;
    const executionMs = 95;

    const promptTokens = Math.ceil(promptText.length / 4);
    const completionTokens = Math.ceil(responseText.length / 4);
    const cost = CostEstimate.calculate(promptTokens, completionTokens, 0.00125, 0.005);
    const latency = Latency.create(4, executionMs);

    const metadata = InferenceMetadata.create({
      providerType: ProviderType.GOOGLE_GEMINI,
      modelId: modelId || 'gemini-1.5-pro',
      promptTokens,
      completionTokens,
      cost,
      latency,
    });

    return InferenceResponse.create(responseText, 'STOP', metadata);
  }
}

@Injectable()
export class OllamaProviderAdapter implements ProviderAdapterPort {
  private readonly logger = new Logger(OllamaProviderAdapter.name);

  public getProviderType(): ProviderType {
    return ProviderType.OLLAMA;
  }

  public async executeInference(request: InferenceRequest, modelId: string): Promise<InferenceResponse> {
    const startTime = Date.now();
    const promptText = request.messages.map(m => m.content).join(' ');

    const responseText = `[Ollama Local ${modelId}] Local inference response: "${request.messages[request.messages.length - 1]?.content}"`;
    const executionMs = 210;

    const promptTokens = Math.ceil(promptText.length / 4);
    const completionTokens = Math.ceil(responseText.length / 4);
    const cost = CostEstimate.calculate(promptTokens, completionTokens, 0.0, 0.0); // Local open-source models zero cost
    const latency = Latency.create(2, executionMs);

    const metadata = InferenceMetadata.create({
      providerType: ProviderType.OLLAMA,
      modelId: modelId || 'llama-3',
      promptTokens,
      completionTokens,
      cost,
      latency,
    });

    return InferenceResponse.create(responseText, 'stop', metadata);
  }
}
