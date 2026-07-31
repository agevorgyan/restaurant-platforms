/**
 * Enterprise AI Gateway - Inference Job Aggregate Root
 *
 * Tracks unified inference requests, execution statuses, fallback provider switches,
 * token usage, latency, and cost calculations.
 */

import { randomUUID } from 'crypto';
import { InferenceStatus, ProviderType, ModelType } from '../enums/ai.enums';
import { InferenceRequest, InferenceResponse, InferenceMetadata } from '../value-objects/ai-vo';
import { BaseDomainEvent } from '../events/ai.events';
import {
  InferenceStartedEvent,
  InferenceCompletedEvent,
  InferenceFailedEvent,
  ProviderFailoverTriggeredEvent,
} from '../events/ai.events';

export interface InferenceJobProps {
  id: string;
  tenantId: string;
  request: InferenceRequest;
  status: InferenceStatus;
  primaryProvider: ProviderType;
  actualProvider?: ProviderType;
  response?: InferenceResponse;
  failoverOccurred: boolean;
  failoverReason?: string;
  errorReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class InferenceJobAggregate {
  private domainEvents: BaseDomainEvent[] = [];

  private constructor(private props: InferenceJobProps) {}

  public static create(params: {
    id?: string;
    tenantId: string;
    request: InferenceRequest;
    primaryProvider: ProviderType;
  }): InferenceJobAggregate {
    const id = params.id || randomUUID();
    const now = new Date();

    const aggregate = new InferenceJobAggregate({
      id,
      tenantId: params.tenantId,
      request: params.request,
      status: InferenceStatus.QUEUED,
      primaryProvider: params.primaryProvider,
      failoverOccurred: false,
      createdAt: now,
      updatedAt: now,
    });

    return aggregate;
  }

  // --- Getters ---
  public getId(): string { return this.props.id; }
  public getTenantId(): string { return this.props.tenantId; }
  public getRequest(): InferenceRequest { return this.props.request; }
  public getStatus(): InferenceStatus { return this.props.status; }
  public getPrimaryProvider(): ProviderType { return this.props.primaryProvider; }
  public getActualProvider(): ProviderType | undefined { return this.props.actualProvider; }
  public getResponse(): InferenceResponse | undefined { return this.props.response; }
  public isFailoverOccurred(): boolean { return this.props.failoverOccurred; }
  public getErrorReason(): string | undefined { return this.props.errorReason; }
  public getCreatedAt(): Date { return this.props.createdAt; }
  public getUpdatedAt(): Date { return this.props.updatedAt; }

  public getUncommittedEvents(): BaseDomainEvent[] { return [...this.domainEvents]; }
  public clearEvents(): void { this.domainEvents = []; }

  private addDomainEvent(event: BaseDomainEvent): void { this.domainEvents.push(event); }

  public markRunning(providerType: ProviderType): void {
    const now = new Date();
    this.props.actualProvider = providerType;
    this.props.status = InferenceStatus.RUNNING;
    this.props.updatedAt = now;

    this.addDomainEvent(
      new InferenceStartedEvent(this.getId(), this.getTenantId(), providerType, this.getRequest().modelType, now)
    );
  }

  public recordFailover(fallbackProvider: ProviderType, reason: string): void {
    const now = new Date();
    this.props.failoverOccurred = true;
    this.props.failoverReason = reason;
    this.props.actualProvider = fallbackProvider;
    this.props.updatedAt = now;

    this.addDomainEvent(
      new ProviderFailoverTriggeredEvent(
        this.getId(),
        this.getTenantId(),
        this.props.primaryProvider,
        fallbackProvider,
        reason,
        now
      )
    );
  }

  public markCompleted(response: InferenceResponse): void {
    const now = new Date();
    this.props.response = response;
    this.props.status = InferenceStatus.COMPLETED;
    this.props.updatedAt = now;

    const meta = response.metadata;
    this.addDomainEvent(
      new InferenceCompletedEvent(
        this.getId(),
        this.getTenantId(),
        meta.providerType,
        meta.modelId,
        meta.totalTokens,
        meta.cost.totalCostUsd,
        meta.latency.totalTimeMs,
        now
      )
    );
  }

  public markFailed(reason: string): void {
    const now = new Date();
    this.props.status = InferenceStatus.FAILED;
    this.props.errorReason = reason;
    this.props.updatedAt = now;

    this.addDomainEvent(
      new InferenceFailedEvent(
        this.getId(),
        this.getTenantId(),
        this.props.actualProvider || this.props.primaryProvider,
        reason,
        now
      )
    );
  }
}
