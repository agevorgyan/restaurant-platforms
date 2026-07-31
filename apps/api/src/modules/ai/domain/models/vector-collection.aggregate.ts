/**
 * Enterprise Embedding & Vector Platform - Vector Collection Aggregate Root
 *
 * Manages vector partitions, vector dimension validation, distance metric configurations,
 * and collection index rebuilding.
 */

import { CollectionType, SimilarityMetric } from '../enums/vector.enums';
import { VectorCollectionId, VectorDimension, EmbeddingModel } from '../value-objects/vector-vo';
import { BaseDomainEvent } from '../events/ai.events';
import { CollectionCreatedEvent } from '../events/vector.events';

export interface VectorCollectionProps {
  id: VectorCollectionId;
  tenantId: string;
  name: string;
  description: string;
  type: CollectionType;
  dimension: VectorDimension;
  model: EmbeddingModel;
  metric: SimilarityMetric;
  vectorCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class VectorCollectionAggregate {
  private domainEvents: BaseDomainEvent[] = [];

  private constructor(private props: VectorCollectionProps) {}

  public static create(params: {
    id?: VectorCollectionId;
    tenantId?: string;
    name: string;
    description: string;
    type?: CollectionType;
    dimension?: number;
    model?: string;
    metric?: SimilarityMetric;
  }): VectorCollectionAggregate {
    const id = params.id || VectorCollectionId.generate();
    const tenantId = params.tenantId || 'tenant-default';
    const type = params.type || CollectionType.KNOWLEDGE_BASE;
    const dimension = VectorDimension.create(params.dimension || 1536);
    const model = EmbeddingModel.create(params.model || 'text-embedding-3-small');
    const metric = params.metric || SimilarityMetric.COSINE;

    const now = new Date();
    const aggregate = new VectorCollectionAggregate({
      id,
      tenantId,
      name: params.name,
      description: params.description,
      type,
      dimension,
      model,
      metric,
      vectorCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    aggregate.addDomainEvent(
      new CollectionCreatedEvent(id.getValue(), tenantId, params.name, type, dimension.dimension, now)
    );

    return aggregate;
  }

  // --- Getters ---
  public getId(): VectorCollectionId { return this.props.id; }
  public getTenantId(): string { return this.props.tenantId; }
  public getName(): string { return this.props.name; }
  public getDescription(): string { return this.props.description; }
  public getType(): CollectionType { return this.props.type; }
  public getDimension(): VectorDimension { return this.props.dimension; }
  public getModel(): EmbeddingModel { return this.props.model; }
  public getMetric(): SimilarityMetric { return this.props.metric; }
  public getVectorCount(): number { return this.props.vectorCount; }
  public getCreatedAt(): Date { return this.props.createdAt; }
  public getUpdatedAt(): Date { return this.props.updatedAt; }

  public getUncommittedEvents(): BaseDomainEvent[] { return [...this.domainEvents]; }
  public clearEvents(): void { this.domainEvents = []; }

  private addDomainEvent(event: BaseDomainEvent): void { this.domainEvents.push(event); }

  public incrementVectorCount(amount: number = 1): void {
    this.props.vectorCount += amount;
    this.props.updatedAt = new Date();
  }

  public validateVector(vector: number[]): void {
    this.props.dimension.validate(vector);
  }
}
