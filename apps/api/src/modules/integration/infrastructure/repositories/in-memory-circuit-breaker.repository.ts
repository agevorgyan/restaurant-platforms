/**
 * Enterprise HTTP & API Integration Platform - In-Memory Circuit Breaker Repository
 *
 * Implements per-connector circuit breaker isolation storage.
 * STRICT RULE: One Circuit Breaker per Connector. Never share breaker state across connectors.
 */

import { Injectable } from '@nestjs/common';
import { CircuitBreakerAggregate } from '../../domain/models/circuit-breaker.aggregate';
import { CircuitBreakerRepositoryPort } from '../../domain/ports/http.ports';

@Injectable()
export class InMemoryCircuitBreakerRepository implements CircuitBreakerRepositoryPort {
  private readonly store = new Map<string, CircuitBreakerAggregate>();

  public async getBreaker(connectorId: string, tenantId: string = 'global'): Promise<CircuitBreakerAggregate> {
    const key = `${tenantId}:${connectorId}`;
    let breaker = this.store.get(key);
    if (!breaker) {
      breaker = new CircuitBreakerAggregate(connectorId, tenantId);
      this.store.set(key, breaker);
    }
    return breaker;
  }

  public async saveBreaker(breaker: CircuitBreakerAggregate): Promise<void> {
    const key = `${breaker.tenantId}:${breaker.getConnectorId()}`;
    this.store.set(key, breaker);
  }

  public async getAllBreakers(tenantId?: string): Promise<CircuitBreakerAggregate[]> {
    const all = Array.from(this.store.values());
    if (tenantId) {
      return all.filter(b => b.tenantId === tenantId);
    }
    return all;
  }

  public clear(): void {
    this.store.clear();
  }
}
