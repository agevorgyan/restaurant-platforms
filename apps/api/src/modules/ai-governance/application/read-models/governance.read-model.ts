export interface PolicyDashboard {
  tenantId: string;
  totalPolicies: number;
  activePolicies: number;
  policiesEvaluatedToday: number;
  violationsToday: number;
}

export interface RiskDashboard {
  tenantId: string;
  averageRiskScore: number;
  highRiskExecutions: number;
  criticalRiskExecutions: number;
}

export interface ComplianceDashboard {
  tenantId: string;
  soc2Compliant: boolean;
  gdprCompliant: boolean;
  lastAuditDate: Date;
}

export interface AuditTrail {
  tenantId: string;
  records: Array<{
    actionId: string;
    actorId: string;
    actionType: string;
    timestamp: Date;
  }>;
}

export interface CertificationReport {
  certificationId: string;
  certified: boolean;
  certifiedAt: Date;
  details: Record<string, any>;
}

export interface SafetyStatistics {
  tenantId: string;
  promptInjectionsBlocked: number;
  jailbreaksBlocked: number;
  piiRedactions: number;
  hallucinationWarnings: number;
}
