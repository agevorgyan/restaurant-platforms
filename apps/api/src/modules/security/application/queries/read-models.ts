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
