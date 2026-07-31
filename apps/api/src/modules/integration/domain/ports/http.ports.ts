/**
 * Enterprise HTTP & API Integration Platform - Hexagonal Domain Ports
 */

import { OutboundRequestAggregate } from '../models/outbound-request.aggregate';
import { CircuitBreakerAggregate } from '../models/circuit-breaker.aggregate';
import { ResponseBody } from '../value-objects/http-vo';

export interface HttpClientPort {
  executeHttpRequest(request: OutboundRequestAggregate): Promise<ResponseBody>;
}

export interface GraphQLClientPort {
  executeGraphQLQuery(request: OutboundRequestAggregate, query: string, variables?: Record<string, unknown>): Promise<ResponseBody>;
}

export interface GrpcClientPort {
  executeGrpcCall(request: OutboundRequestAggregate, serviceName: string, methodName: string, payload: unknown): Promise<ResponseBody>;
}

export interface CircuitBreakerRepositoryPort {
  getBreaker(connectorId: string, tenantId?: string): Promise<CircuitBreakerAggregate>;
  saveBreaker(breaker: CircuitBreakerAggregate): Promise<void>;
  getAllBreakers(tenantId?: string): Promise<CircuitBreakerAggregate[]>;
}

export interface IdempotencyRepositoryPort {
  hasKey(idempotencyKey: string): Promise<boolean>;
  storeKey(idempotencyKey: string, requestId: string, ttlMs?: number): Promise<void>;
}

export interface RequestHistoryRepositoryPort {
  saveRequest(request: OutboundRequestAggregate): Promise<void>;
  findHistory(filters?: {
    tenantId?: string;
    connectorId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<OutboundRequestAggregate[]>;
}
