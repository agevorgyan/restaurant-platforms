/**
 * Enterprise AI Governance & Certification Platform - In-Memory Repository
 */

import { Injectable } from '@nestjs/common';
import { GovernancePolicyAggregate } from '../../domain/models/governance-policy.aggregate';
import { GovernancePolicyId } from '../../domain/value-objects/governance-vo';
import { PolicyType, PolicyStatus } from '../../domain/enums/governance.enums';
import { GovernanceRepositoryPort } from '../../domain/ports/governance.ports';

@Injectable()
export class InMemoryGovernanceRepository implements GovernanceRepositoryPort {
  private readonly store = new Map<string, GovernancePolicyAggregate>();

  public async savePolicy(policy: GovernancePolicyAggregate): Promise<void> {
    this.store.set(policy.getId().getValue(), policy);
  }

  public async findPolicyById(id: GovernancePolicyId): Promise<GovernancePolicyAggregate | null> {
    return this.store.get(id.getValue()) || null;
  }

  public async findPolicies(tenantId?: string, filters?: { type?: PolicyType; status?: PolicyStatus }): Promise<GovernancePolicyAggregate[]> {
    let result = Array.from(this.store.values());

    if (tenantId) {
      result = result.filter(p => p.getTenantId() === tenantId);
    }

    if (filters?.type) {
      result = result.filter(p => p.getPolicyType() === filters.type);
    }

    if (filters?.status) {
      result = result.filter(p => p.getStatus() === filters.status);
    }

    return result;
  }

  public clear(): void {
    this.store.clear();
  }
}
