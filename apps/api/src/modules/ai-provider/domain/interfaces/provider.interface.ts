import { ModelCapabilityEnum, ProviderStatusEnum } from '../value-objects';

export interface AiProvider {
  id: string;
  name: string;
  status: ProviderStatusEnum;
  supportedCapabilities: ModelCapabilityEnum[];
  
  healthCheck(): Promise<boolean>;
  initialize(config: any): Promise<void>;
}

export interface ChatModelProvider extends AiProvider {
  generateChatResponse(modelId: string, messages: any[], options?: any): Promise<any>;
  streamChatResponse(modelId: string, messages: any[], options?: any): AsyncGenerator<any, void, unknown>;
}

export interface EmbeddingProvider extends AiProvider {
  generateEmbeddings(modelId: string, inputs: string[]): Promise<number[][]>;
}

export interface ImageGenerationProvider extends AiProvider {
  generateImage(modelId: string, prompt: string, options?: any): Promise<string[]>; // returns URLs or base64
}

export interface SpeechProvider extends AiProvider {
  transcribeAudio(modelId: string, audioBuffer: Buffer): Promise<string>;
  synthesizeSpeech(modelId: string, text: string, voice?: string): Promise<Buffer>;
}

export interface ModerationProvider extends AiProvider {
  moderateText(modelId: string, text: string): Promise<any>;
}
