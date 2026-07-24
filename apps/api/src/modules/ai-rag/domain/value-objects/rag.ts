import { Identifier, DomainPrimitive } from '@saas/domain';
import { ValueObject } from '@saas/core';

// ENUMS

export enum RetrievalStatusEnum {
  PENDING = 'PENDING',
  RETRIEVING = 'RETRIEVING',
  RANKING = 'RANKING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export class RetrievalStatus extends DomainPrimitive<RetrievalStatusEnum> {
  private constructor(value: RetrievalStatusEnum) { super(value); }
  public static create(value: RetrievalStatusEnum): RetrievalStatus { return new RetrievalStatus(value); }
}

export enum RetrievalStrategyEnum {
  KEYWORD = 'KEYWORD',
  SEMANTIC = 'SEMANTIC',
  HYBRID = 'HYBRID',
  METADATA = 'METADATA'
}

export class RetrievalStrategy extends DomainPrimitive<RetrievalStrategyEnum> {
  private constructor(value: RetrievalStrategyEnum) { super(value); }
  public static create(value: RetrievalStrategyEnum): RetrievalStrategy { return new RetrievalStrategy(value); }
}

// VALUE OBJECTS

export class KnowledgeDocumentId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): KnowledgeDocumentId { return new KnowledgeDocumentId(value); }
  public static generate(): KnowledgeDocumentId { return new KnowledgeDocumentId(crypto.randomUUID()); }
}

export class KnowledgeChunkId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): KnowledgeChunkId { return new KnowledgeChunkId(value); }
  public static generate(): KnowledgeChunkId { return new KnowledgeChunkId(crypto.randomUUID()); }
}

export class EmbeddingId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): EmbeddingId { return new EmbeddingId(value); }
  public static generate(): EmbeddingId { return new EmbeddingId(crypto.randomUUID()); }
}

export class EmbeddingVector extends DomainPrimitive<number[]> {
  private constructor(value: number[]) { super(value); }
  public static create(value: number[]): EmbeddingVector { return new EmbeddingVector(value); }
}

export interface RetrievalRequestProps {
  [key: string]: unknown;
  query: string;
  strategy: RetrievalStrategyEnum;
  filters?: Record<string, any>;
  topK?: number;
}

export class RetrievalRequest extends ValueObject<RetrievalRequestProps> {
  private constructor(props: RetrievalRequestProps) { super(props); }
  public static create(props: RetrievalRequestProps): RetrievalRequest { return new RetrievalRequest(props); }
}

export interface ContextChunkProps {
  [key: string]: unknown;
  chunkId: string;
  documentId: string;
  content: string;
  score: number;
  metadata: Record<string, any>;
}

export class ContextChunk extends ValueObject<ContextChunkProps> {
  private constructor(props: ContextChunkProps) { super(props); }
  public static create(props: ContextChunkProps): ContextChunk { return new ContextChunk(props); }
}

export interface RetrievalResultProps {
  [key: string]: unknown;
  chunks: ContextChunkProps[];
  strategyUsed: RetrievalStrategyEnum;
  executionTimeMs: number;
}

export class RetrievalResult extends ValueObject<RetrievalResultProps> {
  private constructor(props: RetrievalResultProps) { super(props); }
  public static create(props: RetrievalResultProps): RetrievalResult { return new RetrievalResult(props); }
}

export interface ContextWindowProps {
  [key: string]: unknown;
  maxTokens: number;
  currentTokens: number;
}

export class ContextWindow extends ValueObject<ContextWindowProps> {
  private constructor(props: ContextWindowProps) { super(props); }
  public static create(props: ContextWindowProps): ContextWindow { return new ContextWindow(props); }
}

export interface CitationProps {
  [key: string]: unknown;
  sourceId: string;
  sourceType: string;
  snippet: string;
  relevanceScore: number;
}

export class Citation extends ValueObject<CitationProps> {
  private constructor(props: CitationProps) { super(props); }
  public static create(props: CitationProps): Citation { return new Citation(props); }
}

export class KnowledgeSource extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): KnowledgeSource { return new KnowledgeSource(value); }
}

export class RetrievalScore extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): RetrievalScore { return new RetrievalScore(value); }
}

export class FreshnessScore extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): FreshnessScore { return new FreshnessScore(value); }
}
