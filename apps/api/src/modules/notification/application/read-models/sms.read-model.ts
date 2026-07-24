export interface SmsMessageRecord {
  smsId: string;
  tenantId: string;
  senderId?: string;
  recipientNumber: string;
  countryCode?: string;
  message: string;
  segments: number;
  priority: 'BULK' | 'STANDARD' | 'TRANSACTIONAL' | 'CRITICAL';
  status: 'QUEUED' | 'SENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'UNDELIVERED' | 'REJECTED';
  createdAt: Date;
}

export interface SmsDelivery {
  deliveryId: string;
  smsId: string;
  gatewayName: 'TWILIO' | 'VONAGE' | 'MESSAGEBIRD' | 'AWS_SNS' | 'INFOBIP' | 'CUSTOM';
  gatewayMessageId?: string;
  dispatchedAt: Date;
  deliveredAt?: Date;
}

export interface SmsAttempt {
  attemptId: string;
  smsId: string;
  gatewayName: string;
  status: 'SUCCESS' | 'FAILED';
  errorCode?: string;
  errorMessage?: string;
  attemptedAt: Date;
}

export interface SmsStatistics {
  tenantId: string;
  period: string; // YYYY-MM
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  totalSegments: number;
  deliveryRatePercentage: number;
  averageLatencyMs: number;
}

export interface GatewayHealth {
  gatewayName: string;
  isAvailable: boolean;
  latencyMs: number;
  errorRatePercentage: number;
  lastCheckedAt: Date;
}

export interface FailedSms {
  smsId: string;
  gatewayName: string;
  failedAt: Date;
  errorCode: string;
  reason: string;
  isRetryable: boolean;
}
