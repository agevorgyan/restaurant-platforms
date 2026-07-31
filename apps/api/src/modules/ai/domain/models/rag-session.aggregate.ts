/**
 * Enterprise RAG Platform - RAG Session Aggregate Root
 *
 * Manages retrieval pipeline state transitions, Reciprocal Rank Fusion (RRF) re-ranking,
 * context budget assembly, citation tracking, and grounding validation.
 */

import { RetrievalStatus, RetrievalType, ContextType, RankingStrategy } from '../enums/rag.enums';
import {
  RetrievalRequestId,
  ContextChunk,
  RetrievalContext,
  Citation,
  GroundingScore,
} from '../value-objects/rag-vo';
import { BaseDomainEvent } from '../events/ai.events';
import {
  RetrievalStartedEvent,
  ChunksRetrievedEvent,
  ContextRankedEvent,
  ContextAssembledEvent,
  GroundingCompletedEvent,
  ResponseGeneratedEvent,
  HallucinationDetectedEvent,
} from '../events/rag.events';

export interface RagSessionProps {
  id: RetrievalRequestId;
  tenantId: string;
  queryText: string;
  retrievalType: RetrievalType;
  contextType: ContextType;
  rankingStrategy: RankingStrategy;
  status: RetrievalStatus;
  chunks?: ContextChunk[];
  retrievalContext?: RetrievalContext;
  groundingScore?: GroundingScore;
  generatedAnswer?: string;
  citations?: Citation[];
  errorReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class RagSessionAggregate {
  private domainEvents: BaseDomainEvent[] = [];

  private constructor(private props: RagSessionProps) {}

  public static create(params: {
    id?: RetrievalRequestId;
    tenantId?: string;
    queryText: string;
    retrievalType?: RetrievalType;
    contextType?: ContextType;
    rankingStrategy?: RankingStrategy;
  }): RagSessionAggregate {
    const id = params.id || RetrievalRequestId.generate();
    const tenantId = params.tenantId || 'tenant-default';
    const retrievalType = params.retrievalType || RetrievalType.HYBRID_SEARCH;
    const contextType = params.contextType || ContextType.KNOWLEDGE_CONTEXT;
    const rankingStrategy = params.rankingStrategy || RankingStrategy.RECIPROCAL_RANK_FUSION;

    const now = new Date();
    const aggregate = new RagSessionAggregate({
      id,
      tenantId,
      queryText: params.queryText,
      retrievalType,
      contextType,
      rankingStrategy,
      status: RetrievalStatus.QUEUED,
      createdAt: now,
      updatedAt: now,
    });

    aggregate.addDomainEvent(
      new RetrievalStartedEvent(id.getValue(), tenantId, params.queryText, retrievalType, now)
    );

    return aggregate;
  }

  // --- Getters ---
  public getId(): RetrievalRequestId { return this.props.id; }
  public getTenantId(): string { return this.props.tenantId; }
  public getQueryText(): string { return this.props.queryText; }
  public getRetrievalType(): RetrievalType { return this.props.retrievalType; }
  public getContextType(): ContextType { return this.props.contextType; }
  public getRankingStrategy(): RankingStrategy { return this.props.rankingStrategy; }
  public getStatus(): RetrievalStatus { return this.props.status; }
  public getChunks(): ContextChunk[] { return [...(this.props.chunks || [])]; }
  public getRetrievalContext(): RetrievalContext | undefined { return this.props.retrievalContext; }
  public getGroundingScore(): GroundingScore | undefined { return this.props.groundingScore; }
  public getGeneratedAnswer(): string | undefined { return this.props.generatedAnswer; }
  public getCitations(): Citation[] { return [...(this.props.citations || [])]; }
  public getCreatedAt(): Date { return this.props.createdAt; }
  public getUpdatedAt(): Date { return this.props.updatedAt; }

  public getUncommittedEvents(): BaseDomainEvent[] { return [...this.domainEvents]; }
  public clearEvents(): void { this.domainEvents = []; }

  private addDomainEvent(event: BaseDomainEvent): void { this.domainEvents.push(event); }

  public recordChunksRetrieved(chunks: ContextChunk[]): void {
    const now = new Date();
    this.props.chunks = chunks;
    this.props.status = RetrievalStatus.RETRIEVING;
    this.props.updatedAt = now;

    this.addDomainEvent(
      new ChunksRetrievedEvent(this.getId().getValue(), this.getTenantId(), chunks.length, now)
    );
  }

  public recordRankedContext(rankedChunks: ContextChunk[]): void {
    const now = new Date();
    this.props.chunks = rankedChunks;
    this.props.status = RetrievalStatus.RANKING;
    this.props.updatedAt = now;

    this.addDomainEvent(
      new ContextRankedEvent(this.getId().getValue(), this.getTenantId(), rankedChunks.length, now)
    );
  }

  public recordAssembledContext(retrievalContext: RetrievalContext): void {
    const now = new Date();
    this.props.retrievalContext = retrievalContext;
    this.props.status = RetrievalStatus.ASSEMBLING;
    this.props.updatedAt = now;

    this.addDomainEvent(
      new ContextAssembledEvent(
        this.getId().getValue(),
        this.getTenantId(),
        retrievalContext.totalTokensEstimated,
        retrievalContext.citations.length,
        now
      )
    );
  }

  public completeSession(generatedAnswer: string, citations: Citation[], groundingScore: GroundingScore): void {
    const now = new Date();
    this.props.generatedAnswer = generatedAnswer;
    this.props.citations = citations;
    this.props.groundingScore = groundingScore;
    this.props.status = RetrievalStatus.COMPLETED;
    this.props.updatedAt = now;

    this.addDomainEvent(
      new GroundingCompletedEvent(
        this.getId().getValue(),
        this.getTenantId(),
        groundingScore.percentage,
        groundingScore.isGroundingSufficient,
        now
      )
    );

    if (!groundingScore.isGroundingSufficient) {
      this.addDomainEvent(
        new HallucinationDetectedEvent(
          this.getId().getValue(),
          this.getTenantId(),
          groundingScore.percentage,
          'Answer grounding score fell below minimum quality threshold',
          now
        )
      );
    }

    this.addDomainEvent(
      new ResponseGeneratedEvent(
        this.getId().getValue(),
        this.getTenantId(),
        generatedAnswer.length,
        citations.length,
        now
      )
    );
  }
}
