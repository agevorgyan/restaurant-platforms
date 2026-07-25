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

