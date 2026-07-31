/**
 * Enterprise Embedding & Vector Platform - Vector Embedding Entity
 *
 * Represents an individual document/text chunk vector embedding record.
 */

import { EmbeddingStatus, VectorType } from '../enums/vector.enums';
import { EmbeddingId, VectorCollectionId, ChunkMetadata } from '../value-objects/vector-vo';

export interface VectorEmbeddingProps {
  id: EmbeddingId;
  collectionId: VectorCollectionId;
  tenantId: string;
  vectorType: VectorType;
  contentChunk: string;
  vector: number[]; // Array of floating point numbers (e.g. 1536 floats)
  status: EmbeddingStatus;
  chunkMetadata?: ChunkMetadata;
  customMetadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export class VectorEmbeddingEntity {
  private constructor(private props: VectorEmbeddingProps) {}

  public static create(params: {
    id?: EmbeddingId;
    collectionId: VectorCollectionId;
    tenantId: string;
    vectorType?: VectorType;
    contentChunk: string;
    vector: number[];
    chunkMetadata?: ChunkMetadata;
    customMetadata?: Record<string, unknown>;
  }): VectorEmbeddingEntity {
    const id = params.id || EmbeddingId.generate();
    const vectorType = params.vectorType || VectorType.TEXT_EMBEDDING;
    const now = new Date();

    return new VectorEmbeddingEntity({
      id,
      collectionId: params.collectionId,
      tenantId: params.tenantId,
      vectorType,
      contentChunk: params.contentChunk,
      vector: params.vector,
      status: EmbeddingStatus.READY,
      chunkMetadata: params.chunkMetadata,
      customMetadata: params.customMetadata || {},
      createdAt: now,
      updatedAt: now,
    });
  }

  // --- Getters ---
  public getId(): EmbeddingId { return this.props.id; }
  public getCollectionId(): VectorCollectionId { return this.props.collectionId; }
  public getTenantId(): string { return this.props.tenantId; }
  public getVectorType(): VectorType { return this.props.vectorType; }
  public getContentChunk(): string { return this.props.contentChunk; }
  public getVector(): number[] { return [...this.props.vector]; }
  public getStatus(): EmbeddingStatus { return this.props.status; }
  public getChunkMetadata(): ChunkMetadata | undefined { return this.props.chunkMetadata; }
  public getCustomMetadata(): Record<string, unknown> { return { ...this.props.customMetadata }; }
  public getCreatedAt(): Date { return this.props.createdAt; }
  public getUpdatedAt(): Date { return this.props.updatedAt; }
}
