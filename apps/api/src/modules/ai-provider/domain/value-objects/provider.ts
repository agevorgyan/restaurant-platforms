import { Identifier, DomainPrimitive } from '@saas/domain';
import { ValueObject } from '@saas/core';

// ENUMS

export enum ProviderStatusEnum {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  DEGRADED = 'DEGRADED',
  MAINTENANCE = 'MAINTENANCE'
}

export class ProviderStatus extends DomainPrimitive<ProviderStatusEnum> {
  private constructor(value: ProviderStatusEnum) { super(value); }
  public static create(value: ProviderStatusEnum): ProviderStatus { return new ProviderStatus(value); }
}

export enum ModelCapabilityEnum {
  CHAT = 'CHAT',
  REASONING = 'REASONING',
  EMBEDDING = 'EMBEDDING',
  IMAGE_GENERATION = 'IMAGE_GENERATION',
  VISION = 'VISION',
  SPEECH_TO_TEXT = 'SPEECH_TO_TEXT',
  TEXT_TO_SPEECH = 'TEXT_TO_SPEECH',
  MODERATION = 'MODERATION',
  FUNCTION_CALLING = 'FUNCTION_CALLING',
  STRUCTURED_OUTPUT = 'STRUCTURED_OUTPUT',
  STREAMING = 'STREAMING'
}

export class ModelCapability extends DomainPrimitive<ModelCapabilityEnum> {
  private constructor(value: ModelCapabilityEnum) { super(value); }
  public static create(value: ModelCapabilityEnum): ModelCapability { return new ModelCapability(value); }
}

// VALUE OBJECTS

export class ProviderId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ProviderId { return new ProviderId(value); }
  public static generate(): ProviderId { return new ProviderId(crypto.randomUUID()); }
}

export class ProviderName extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ProviderName { return new ProviderName(value); }
}

export class ModelId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ModelId { return new ModelId(value); }
  public static generate(): ModelId { return new ModelId(crypto.randomUUID()); }
}

export class ModelName extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ModelName { return new ModelName(value); }
}

export class ModelVersion extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ModelVersion { return new ModelVersion(value); }
}

export interface ModelContextWindowProps {
  [key: string]: unknown;
  maxTokens: number;
  maxCompletionTokens?: number;
}

export class ModelContextWindow extends ValueObject<ModelContextWindowProps> {
  private constructor(props: ModelContextWindowProps) { super(props); }
  public static create(props: ModelContextWindowProps): ModelContextWindow { return new ModelContextWindow(props); }
}

export class ModelLatency extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): ModelLatency { return new ModelLatency(value); }
}

export interface ModelCostProps {
  [key: string]: unknown;
  inputCostPer1k: number;
  outputCostPer1k: number;
}

export class ModelCost extends ValueObject<ModelCostProps> {
  private constructor(props: ModelCostProps) { super(props); }
  public static create(props: ModelCostProps): ModelCost { return new ModelCost(props); }
}

export interface ProviderHealthProps {
  [key: string]: unknown;
  status: ProviderStatusEnum;
  latencyMs: number;
  errorRate: number;
  lastChecked: Date;
}

export class ProviderHealth extends ValueObject<ProviderHealthProps> {
  private constructor(props: ProviderHealthProps) { super(props); }
  public static create(props: ProviderHealthProps): ProviderHealth { return new ProviderHealth(props); }
}

export class ProviderPriority extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): ProviderPriority { return new ProviderPriority(value); }
}

export class ProviderWeight extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): ProviderWeight { return new ProviderWeight(value); }
}
