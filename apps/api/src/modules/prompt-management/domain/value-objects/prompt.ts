import { Identifier, DomainPrimitive } from '@saas/domain';
import { ValueObject } from '@saas/core';

// ENUMS

export enum PromptStatusEnum {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  DEPRECATED = 'DEPRECATED',
  ARCHIVED = 'ARCHIVED'
}

export class PromptStatus extends DomainPrimitive<PromptStatusEnum> {
  private constructor(value: PromptStatusEnum) { super(value); }
  public static create(value: PromptStatusEnum): PromptStatus { return new PromptStatus(value); }
}

export enum PromptTypeEnum {
  SYSTEM = 'SYSTEM',
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
  TOOL = 'TOOL',
  WORKFLOW = 'WORKFLOW',
  RAG = 'RAG',
  EVALUATION = 'EVALUATION',
  MODERATION = 'MODERATION'
}

export class PromptType extends DomainPrimitive<PromptTypeEnum> {
  private constructor(value: PromptTypeEnum) { super(value); }
  public static create(value: PromptTypeEnum): PromptType { return new PromptType(value); }
}

// VALUE OBJECTS

export class PromptId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PromptId { return new PromptId(value); }
  public static generate(): PromptId { return new PromptId(crypto.randomUUID()); }
}

export class PromptVersionId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PromptVersionId { return new PromptVersionId(value); }
  public static generate(): PromptVersionId { return new PromptVersionId(crypto.randomUUID()); }
}

export class PromptTemplate extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PromptTemplate { return new PromptTemplate(value); }
}

export interface PromptVariableProps {
  [key: string]: unknown;
  name: string;
  description?: string;
  required: boolean;
}

export class PromptVariable extends ValueObject<PromptVariableProps> {
  private constructor(props: PromptVariableProps) { super(props); }
  public static create(props: PromptVariableProps): PromptVariable { return new PromptVariable(props); }
}

export interface PromptParameterProps {
  [key: string]: unknown;
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
}

export class PromptParameter extends ValueObject<PromptParameterProps> {
  private constructor(props: PromptParameterProps) { super(props); }
  public static create(props: PromptParameterProps): PromptParameter { return new PromptParameter(props); }
}

export interface PromptMetadataProps {
  [key: string]: unknown;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  description: string;
}

export class PromptMetadata extends ValueObject<PromptMetadataProps> {
  private constructor(props: PromptMetadataProps) { super(props); }
  public static create(props: PromptMetadataProps): PromptMetadata { return new PromptMetadata(props); }
}

export class PromptContext extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PromptContext { return new PromptContext(value); }
}

export class PromptHash extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PromptHash { return new PromptHash(value); }
}

export class PromptSignature extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PromptSignature { return new PromptSignature(value); }
}

export class PromptCategory extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PromptCategory { return new PromptCategory(value); }
}

export interface PromptPolicyProps {
  [key: string]: unknown;
  requiresReview: boolean;
  allowedModels: string[];
}

export class PromptPolicy extends ValueObject<PromptPolicyProps> {
  private constructor(props: PromptPolicyProps) { super(props); }
  public static create(props: PromptPolicyProps): PromptPolicy { return new PromptPolicy(props); }
}

export class PromptTag extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PromptTag { return new PromptTag(value); }
}
