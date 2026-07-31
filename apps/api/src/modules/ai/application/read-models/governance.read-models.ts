/**
 * Enterprise AI Governance & Certification Platform - CQRS Read Models
 */

import { PolicyType, PolicyStatus, RiskLevel } from '../../domain/enums/governance.enums';

export interface PolicyCatalogEntry {
  id: string;
  name: string;
  policyType: PolicyType;
  status: PolicyStatus;
  riskLevel: RiskLevel;
  violationsCount: number;
}

export interface PolicyCatalog {
  totalPolicies: number;
  policies: PolicyCatalogEntry[];
}

export interface AuditHistoryItem {
  auditId: string;
  tenantId: string;
  entityType: string;
  actionName: string;
  status: string;
  timestamp: Date;
}

export interface AuditHistory {
  totalAudits: number;
  history: AuditHistoryItem[];
}

export interface GovernanceCostDashboard {
  monthlyLimitUsd: number;
  currentSpendUsd: number;
  budgetUtilizationPercentage: number;
  violationsCount: number;
}

export interface RiskDashboard {
  overallRiskLevel: RiskLevel;
  totalViolations: number;
  byRiskLevel: Record<RiskLevel, number>;
}

export interface SafetyDashboard {
  piiScansCount: number;
  piiDetectedCount: number;
  blockedRequestsCount: number;
  safetyScorePercentage: number;
}

export interface CertificationHistoryEntry {
  certificationId: string;
  certifiedBy: string;
  environment: string;
  overallScore: number;
  status: string;
  certifiedAt: Date;
}

export interface CertificationHistory {
  totalCertifications: number;
  certifications: CertificationHistoryEntry[];
}
