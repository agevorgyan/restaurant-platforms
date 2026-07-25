export class ActiveSessionReadModel {
  sessionId!: string;
  userId!: string;
  ipAddress!: string;
  deviceFingerprint!: string;
  createdAt!: Date;
  lastAccessedAt!: Date;
  expiresAt!: Date;
}

export class LoginHistoryReadModel {
  id!: string;
  userId!: string;
  timestamp!: Date;
  successful!: boolean;
  ipAddress!: string;
  deviceFingerprint!: string;
  location?: string;
  failureReason?: string;
}

export class TrustedDeviceReadModel {
  id!: string;
  userId!: string;
  deviceFingerprint!: string;
  createdAt!: Date;
  lastUsedAt!: Date;
}

export class AuthenticationStatisticsReadModel {
  totalLogins!: number;
  successfulLogins!: number;
  failedLogins!: number;
  mfaUsageRate!: number;
  periodStart!: Date;
  periodEnd!: Date;
}

export class FailedLoginReportReadModel {
  userId!: string;
  failuresCount!: number;
  lastFailureAt!: Date;
}

export class RoleCatalogReadModel {
  id!: string;
  name!: string;
  tenantId?: string;
  description?: string;
  parentRoleId?: string;
  permissions!: string[];
}

export class PermissionCatalogReadModel {
  id!: string;
  name!: string;
  resourceType!: string;
  action!: string;
  scope!: string;
  description?: string;
}

export class AuthorizationStatisticsReadModel {
  totalRequests!: number;
  allowedRequests!: number;
  deniedRequests!: number;
  periodStart!: Date;
  periodEnd!: Date;
}

export class AccessDeniedReportReadModel {
  id!: string;
  userId!: string;
  resourceId!: string;
  action!: string;
  reason!: string;
  timestamp!: Date;
}

export class PolicyEvaluationHistoryReadModel {
  id!: string;
  policyId!: string;
  userId!: string;
  resourceId!: string;
  decision!: string;
  timestamp!: Date;
}

export class SecretCatalogReadModel {
  id!: string;
  name!: string;
  type!: string;
  status!: string;
  currentVersionId!: string;
  lastRotatedAt?: Date;
}

export class KeyCatalogReadModel {
  id!: string;
  algorithm!: string;
  currentVersion!: string;
  isExportable!: boolean;
  createdAt!: Date;
}

export class CertificateInventoryReadModel {
  id!: string;
  fingerprint!: string;
  subject!: string;
  issuer!: string;
  expirationDate!: Date;
  isActive!: boolean;
}

export class RotationHistoryReadModel {
  id!: string;
  secretId!: string;
  previousVersionId!: string;
  newVersionId!: string;
  rotatedAt!: Date;
}

export class ExpirationDashboardReadModel {
  expiringSecrets!: number;
  expiringCertificates!: number;
  soonestExpirationDate?: Date;
}

export class AuditTimelineReadModel {
  id!: string;
  category!: string;
  severity!: string;
  actorId!: string;
  resourceId!: string;
  action!: string;
  resultStatus!: string;
  timestamp!: Date;
  status!: string;
}

export class ComplianceDashboardReadModel {
  framework!: string;
  lastGeneratedAt!: Date;
  status!: string;
  coveragePercentage!: number;
}

export class SecurityEventsReadModel {
  eventId!: string;
  severity!: string;
  description!: string;
  timestamp!: Date;
}

export class DataAccessHistoryReadModel {
  id!: string;
  actorId!: string;
  resourceType!: string;
  resourceId!: string;
  timestamp!: Date;
}

export class EvidenceCatalogReadModel {
  evidenceId!: string;
  reportId!: string;
  collectedAt!: Date;
  url!: string;
}

export class RetentionDashboardReadModel {
  totalRecords!: number;
  recordsArchived!: number;
  recordsExpired!: number;
  nextArchivalRun?: Date;
}

export class ThreatDashboardReadModel {
  totalThreatsDetected!: number;
  criticalThreats!: number;
  openIncidents!: number;
  averageRiskScore!: number;
  periodStart!: Date;
  periodEnd!: Date;
}

export class SecurityIncidentsReadModel {
  id!: string;
  title!: string;
  severity!: string;
  status!: string;
  relatedThreatCount!: number;
  createdAt!: Date;
}

export class ThreatTimelineReadModel {
  id!: string;
  type!: string;
  level!: string;
  actorId!: string;
  score!: number;
  detectedAt!: Date;
}

export class ActiveAlertsReadModel {
  id!: string;
  incidentId!: string;
  channel!: string;
  message!: string;
  isAcknowledged!: boolean;
  createdAt!: Date;
}

export class RiskScoresReadModel {
  actorId!: string;
  currentScore!: number;
  scoreHistory!: Array<{ score: number; at: Date }>;
}

export class AttackStatisticsReadModel {
  bruteForceAttempts!: number;
  credentialStuffingAttempts!: number;
  accountTakeoverAttempts!: number;
  apiAbuseAttempts!: number;
  periodStart!: Date;
  periodEnd!: Date;
}


