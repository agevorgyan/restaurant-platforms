/**
 * Enterprise RAG Platform - Hexagonal Domain Ports
 */

import { RagSessionAggregate } from '../models/rag-session.aggregate';
import { RetrievalRequestId, ContextChunk } from '../value-objects/rag-vo';

export interface RagRepositoryPort {
  saveSession(session: RagSessionAggregate): Promise<void>;
  findSessionById(id: RetrievalRequestId): Promise<RagSessionAggregate | null>;
  findSessions(tenantId?: string, limit?: number): Promise<RagSessionAggregate[]>;
}

export interface RerankerPort {
  rerank(queryText: string, chunks: ContextChunk[], topK?: number): Promise<ContextChunk[]>;
}
