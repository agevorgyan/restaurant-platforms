import { Identifier, DomainPrimitive } from '@saas/domain';
import { ValueObject } from '@saas/core';

// ENUMS

export enum AiSessionStatusEnum {
  CREATED = 'CREATED',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED'
}

export class AiSessionStatus extends DomainPrimitive<AiSessionStatusEnum> {
  private constructor(value: AiSessionStatusEnum) { super(value); }
  public static create(value: AiSessionStatusEnum): AiSessionStatus { return new AiSessionStatus(value); }
}

export enum ExecutionStatusEnum {
  QUEUED = 'QUEUED',
  EXECUTING = 'EXECUTING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  TIMEDOUT = 'TIMEDOUT',
  CANCELLED = 'CANCELLED'
}

export class ExecutionStatus extends DomainPrimitive<ExecutionStatusEnum> {
  private constructor(value: ExecutionStatusEnum) { super(value); }
  public static create(value: ExecutionStatusEnum): ExecutionStatus { return new ExecutionStatus(value); }
}

// VALUE OBJECTS

export class AiSessionId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AiSessionId { return new AiSessionId(value); }
  public static generate(): AiSessionId { return new AiSessionId(crypto.randomUUID()); }
}

export class ConversationId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ConversationId { return new ConversationId(value); }
  public static generate(): ConversationId { return new ConversationId(crypto.randomUUID()); }
}

export class AiRequestId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AiRequestId { return new AiRequestId(value); }
  public static generate(): AiRequestId { return new AiRequestId(crypto.randomUUID()); }
}

export class AiResponseId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AiResponseId { return new AiResponseId(value); }
  public static generate(): AiResponseId { return new AiResponseId(crypto.randomUUID()); }
}

export class ExecutionId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ExecutionId { return new ExecutionId(value); }
  public static generate(): ExecutionId { return new ExecutionId(crypto.randomUUID()); }
}

export class PromptId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PromptId { return new PromptId(value); }
  public static generate(): PromptId { return new PromptId(crypto.randomUUID()); }
}

export class ContextId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ContextId { return new ContextId(value); }
  public static generate(): ContextId { return new ContextId(crypto.randomUUID()); }
}

export interface AiModelReferenceProps {
  [key: string]: unknown;
  provider: string; // e.g., 'openai', 'anthropic', 'google'
  modelId: string;  // e.g., 'gpt-4o', 'claude-3.5-sonnet', 'gemini-1.5-pro'
  version?: string;
}

export class AiModelReference extends ValueObject<AiModelReferenceProps> {
  private constructor(props: AiModelReferenceProps) { super(props); }
  public static create(props: AiModelReferenceProps): AiModelReference { return new AiModelReference(props); }
}

export interface AiPolicyReferenceProps {
  [key: string]: unknown;
  policyId: string;
  enforcementLevel: 'WARN' | 'BLOCK' | 'AUDIT_ONLY';
}

export class AiPolicyReference extends ValueObject<AiPolicyReferenceProps> {
  private constructor(props: AiPolicyReferenceProps) { super(props); }
  public static create(props: AiPolicyReferenceProps): AiPolicyReference { return new AiPolicyReference(props); }
}

export interface TokenUsageProps {
  [key: string]: unknown;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export class TokenUsage extends ValueObject<TokenUsageProps> {
  private constructor(props: TokenUsageProps) { super(props); }
  public static create(props: TokenUsageProps): TokenUsage { return new TokenUsage(props); }
}

export class ExecutionCost extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): ExecutionCost { return new ExecutionCost(value); }
}

export class LatencyMetric extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): LatencyMetric { return new LatencyMetric(value); }
}

export class ConfidenceScore extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): ConfidenceScore { return new ConfidenceScore(value); }
}
