export interface EmailMessage {
  emailId: string;
  tenantId: string;
  fromAddress: string;
  toAddress: string;
  ccAddresses: string[];
  bccAddresses: string[];
  subject: string;
  priority: 'BULK' | 'STANDARD' | 'TRANSACTIONAL';
  status: 'DRAFT' | 'QUEUED' | 'SENDING' | 'DELIVERED' | 'BOUNCED' | 'DEFERRED' | 'COMPLAINED';
  createdAt: Date;
}

export interface EmailDelivery {
  deliveryId: string;
  emailId: string;
  providerName: 'AWS_SES' | 'SENDGRID' | 'MAILGUN' | 'POSTMARK' | 'SMTP';
  providerMessageId?: string;
  dispatchedAt: Date;
  deliveredAt?: Date;
}

export interface EmailAttempt {
  attemptId: string;
  emailId: string;
  providerName: string;
  status: 'SUCCESS' | 'FAILED';
  errorMessage?: string;
  attemptedAt: Date;
}

export interface EmailStatistics {
  tenantId: string;
  period: string; // YYYY-MM
  totalSent: number;
  totalDelivered: number;
  totalBounced: number;
  totalComplained: number;
  deliveryRatePercentage: number;
  averageLatencyMs: number;
}

export interface ProviderHealth {
  providerName: string;
  isAvailable: boolean;
  activeConnections?: number;
  latencyMs: number;
  errorRatePercentage: number;
  lastCheckedAt?: Date;
}

export interface FailedEmail {
  emailId: string;
  providerName: string;
  failedAt: Date;
  reason: string;
  bounceType?: 'HARD_BOUNCE' | 'SOFT_BOUNCE' | 'SPAM_COMPLAINT' | 'INVALID_ADDRESS' | 'UNKNOWN';
  isRetryable: boolean;
}
