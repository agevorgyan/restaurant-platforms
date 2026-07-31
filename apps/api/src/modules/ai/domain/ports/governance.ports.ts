/**
 * Enterprise AI Governance & Certification Platform - Hexagonal Domain Ports
 */

import { GovernancePolicyAggregate } from '../models/governance-policy.aggregate';
import { GovernancePolicyId } from '../value-objects/governance-vo';
import { PolicyType, PolicyStatus } from '../enums/governance.enums';

export interface GovernanceRepositoryPort {
  savePolicy(policy: GovernancePolicyAggregate): Promise<void>;
  findPolicyById(id: GovernancePolicyId): Promise<GovernancePolicyAggregate | null>;
  findPolicies(tenantId?: string, filters?: { type?: PolicyType; status?: PolicyStatus }): Promise<GovernancePolicyAggregate[]>;
}
