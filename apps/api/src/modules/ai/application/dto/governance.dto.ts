/**
 * Enterprise AI Governance & Certification Platform - Application DTOs
 */

import { PolicyType, PolicyStatus, RiskLevel } from '../../domain/enums/governance.enums';

export interface CreatePolicyDto {
  name: string;
  description: string;
  policyType?: PolicyType;
  riskLevel?: RiskLevel;
  rulesConfig?: Record<string, unknown>;
}

export interface CertifyPlatformDto {
  certifiedBy: string;
  environment: string;
}

export interface PolicyResponseDto {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  policyType: PolicyType;
  status: PolicyStatus;
  riskLevel: RiskLevel;
  violationsCount: number;
  createdAt: Date;
  updatedAt: Date;
}
