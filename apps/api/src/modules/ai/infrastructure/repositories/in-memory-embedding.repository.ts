/**
 * Enterprise Embedding & Vector Platform - In-Memory Embedding Repository
 */

import { Injectable } from '@nestjs/common';
import { VectorCollectionAggregate } from '../../domain/models/vector-collection.aggregate';
import { VectorEmbeddingEntity } from '../../domain/models/vector-embedding.entity';
import { VectorCollectionId } from '../../domain/value-objects/vector-vo';
import { EmbeddingRepositoryPort } from '../../domain/ports/vector.ports';

@Injectable()
export class InMemoryEmbeddingRepository implements EmbeddingRepositoryPort {
  private readonly collections = new Map<string, VectorCollectionAggregate>();
  private readonly embeddings = new Map<string, VectorEmbeddingEntity[]>();

  public async saveCollection(collection: VectorCollectionAggregate): Promise<void> {
    this.collections.set(collection.getId().getValue(), collection);
  }

  public async findCollectionById(id: VectorCollectionId): Promise<VectorCollectionAggregate | null> {
    return this.collections.get(id.getValue()) || null;
  }

  public async findCollections(tenantId?: string): Promise<VectorCollectionAggregate[]> {
    let result = Array.from(this.collections.values());
    if (tenantId) {
      result = result.filter(c => c.getTenantId() === tenantId);
    }
    return result;
  }

  public async saveEmbedding(embedding: VectorEmbeddingEntity): Promise<void> {
    const colId = embedding.getCollectionId().getValue();
    const existing = this.embeddings.get(colId) || [];
    existing.push(embedding);
    this.embeddings.set(colId, existing);
  }

  public async findEmbeddingsByCollection(collectionId: VectorCollectionId): Promise<VectorEmbeddingEntity[]> {
    return this.embeddings.get(collectionId.getValue()) || [];
  }

  public clear(): void {
    this.collections.clear();
    this.embeddings.clear();
  }
}
