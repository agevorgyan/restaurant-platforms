/**
 * Enterprise Embedding & Vector Platform - Domain Value Objects
 */

import { randomUUID } from 'crypto';
import { SimilarityMetric } from '../enums/vector.enums';
import { InvalidVectorDimensionException, VectorDomainException } from '../exceptions/vector.exceptions';

export class EmbeddingId {
  private constructor(private readonly value: string) {}

  public static create(value: string): EmbeddingId {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new VectorDomainException('EmbeddingId cannot be empty');
    }
    return new EmbeddingId(value.trim());
  }

  public static generate(): EmbeddingId {
    return new EmbeddingId(randomUUID());
  }

  public getValue(): string {
    return this.value;
  }
}

export class VectorCollectionId {
  private constructor(private readonly value: string) {}

  public static create(value: string): VectorCollectionId {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new VectorDomainException('VectorCollectionId cannot be empty');
    }
    return new VectorCollectionId(value.trim());
  }

  public static generate(): VectorCollectionId {
    return new VectorCollectionId(randomUUID());
  }

  public getValue(): string {
    return this.value;
  }
}

export class EmbeddingModel {
  private constructor(private readonly value: string) {}

  public static create(modelNameStr: string = 'text-embedding-3-small'): EmbeddingModel {
    const trimmed = modelNameStr?.trim();
    if (!trimmed) throw new VectorDomainException('EmbeddingModel cannot be empty');
    return new EmbeddingModel(trimmed);
  }

  public getValue(): string {
    return this.value;
  }
}

export class VectorDimension {
  private constructor(public readonly dimension: number) {}

  public static create(dim: number = 1536): VectorDimension {
    if (!dim || dim <= 0) {
      throw new VectorDomainException('Vector dimension must be a positive integer');
    }
    return new VectorDimension(dim);
  }

  public validate(vector: number[]): void {
    if (!vector || vector.length !== this.dimension) {
      throw new InvalidVectorDimensionException(this.dimension, vector?.length || 0);
    }
  }
}

export class SimilarityScore {
  private constructor(public readonly score: number) {}

  public static create(val: number): SimilarityScore {
    const clamped = Math.max(0, Math.min(1, val));
    return new SimilarityScore(clamped);
  }
}

export class ChunkMetadata {
  constructor(
    public readonly chunkIndex: number,
    public readonly startChar: number,
    public readonly endChar: number,
    public readonly parentDocId?: string
  ) {}

  public static create(chunkIndex: number, startChar: number, endChar: number, parentDocId?: string): ChunkMetadata {
    return new ChunkMetadata(chunkIndex, startChar, endChar, parentDocId);
  }
}

export class SearchQuery {
  constructor(
    public readonly queryText: string,
    public readonly topK: number = 5,
    public readonly metric: SimilarityMetric = SimilarityMetric.COSINE,
    public readonly filter?: Record<string, unknown>
  ) {}

  public static create(params: {
    queryText: string;
    topK?: number;
    metric?: SimilarityMetric;
    filter?: Record<string, unknown>;
  }): SearchQuery {
    if (!params.queryText || params.queryText.trim().length === 0) {
      throw new VectorDomainException('Search query text cannot be empty');
    }
    return new SearchQuery(
      params.queryText.trim(),
      params.topK || 5,
      params.metric || SimilarityMetric.COSINE,
      params.filter
    );
  }
}

export class SearchResult {
  constructor(
    public readonly vectorId: string,
    public readonly contentChunk: string,
    public readonly score: number,
    public readonly metadata: Record<string, unknown>
  ) {}

  public static create(vectorId: string, contentChunk: string, score: number, metadata: Record<string, unknown> = {}): SearchResult {
    return new SearchResult(vectorId, contentChunk, score, metadata);
  }
}
