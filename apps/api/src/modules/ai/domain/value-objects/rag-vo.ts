/**
 * Enterprise RAG Platform - Domain Value Objects
 */

import { randomUUID } from 'crypto';
import { RagDomainException } from '../exceptions/rag.exceptions';

export class RetrievalRequestId {
  private constructor(private readonly value: string) {}

  public static create(value: string): RetrievalRequestId {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new RagDomainException('RetrievalRequestId cannot be empty');
    }
    return new RetrievalRequestId(value.trim());
  }

  public static generate(): RetrievalRequestId {
    return new RetrievalRequestId(randomUUID());
  }

  public getValue(): string {
    return this.value;
  }
}

export class ContextChunk {
  constructor(
    public readonly chunkId: string,
    public readonly collectionId: string,
    public readonly text: string,
    public readonly score: number,
    public readonly metadata: Record<string, unknown> = {}
  ) {}

  public static create(chunkId: string, collectionId: string, text: string, score: number, metadata: Record<string, unknown> = {}): ContextChunk {
    return new ContextChunk(chunkId, collectionId, text, score, metadata);
  }
}

export class ContextBudget {
  constructor(
    public readonly maxTokens: number = 4000,
    public readonly maxChars: number = 16000
  ) {}

  public static create(maxTokens: number = 4000): ContextBudget {
    const clampedTokens = Math.max(500, maxTokens);
    return new ContextBudget(clampedTokens, clampedTokens * 4);
  }
}

export class Citation {
  constructor(
    public readonly citationId: string,
    public readonly sourceTitle: string,
    public readonly chunkId: string,
    public readonly excerpt: string,
    public readonly confidenceScore: number
  ) {}

  public static create(sourceTitle: string, chunkId: string, excerpt: string, confidenceScore: number = 0.95): Citation {
    return new Citation(randomUUID(), sourceTitle, chunkId, excerpt, confidenceScore);
  }
}

export class GroundingScore {
  constructor(
    public readonly percentage: number, // 0 - 100
    public readonly isGroundingSufficient: boolean
  ) {}

  public static calculate(percentage: number, threshold: number = 60.0): GroundingScore {
    const clamped = Math.max(0, Math.min(100, percentage));
    return new GroundingScore(clamped, clamped >= threshold);
  }
}

export class SourceReference {
  constructor(
    public readonly collectionName: string,
    public readonly chunkId: string,
    public readonly uri?: string
  ) {}

  public static create(collectionName: string, chunkId: string, uri?: string): SourceReference {
    return new SourceReference(collectionName, chunkId, uri);
  }
}

export class RetrievalContext {
  constructor(
    public readonly promptContextText: string,
    public readonly chunksUsed: ContextChunk[],
    public readonly citations: Citation[],
    public readonly totalTokensEstimated: number
  ) {}

  public static create(promptText: string, chunks: ContextChunk[], citations: Citation[]): RetrievalContext {
    const tokens = Math.ceil(promptText.length / 4);
    return new RetrievalContext(promptText, chunks, citations, tokens);
  }
}
