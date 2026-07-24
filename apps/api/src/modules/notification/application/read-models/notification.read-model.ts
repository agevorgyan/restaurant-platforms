export interface NotificationDefinition {
  notificationId: string;
  type: 'TRANSACTIONAL' | 'PROMOTIONAL' | 'SYSTEM_ALERT' | 'CHAT';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
  recipientId?: string;
  tenantId: string;
  payload: Record<string, any>;
  createdAt: Date;
}

export interface NotificationDelivery {
  deliveryId: string;
  notificationId: string;
  channel: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP' | 'WHATSAPP' | 'TELEGRAM' | 'VOICE';
  status: 'PENDING' | 'QUEUED' | 'SENDING' | 'DELIVERED' | 'FAILED' | 'BOUNCED' | 'OPENED' | 'CLICKED';
  providerMessageId?: string;
  sentAt?: Date;
  deliveredAt?: Date;
}

export interface NotificationAttempt {
  attemptId: string;
  deliveryId: string;
  attemptNumber: number;
  status: 'SUCCESS' | 'FAILED';
  errorMessage?: string;
  timestamp: Date;
}

export interface NotificationPreference {
  userId: string;
  tenantId: string;
  optedOutChannels: string[];
  optedOutTypes: string[];
  quietHoursStart?: string; // e.g. "22:00"
  quietHoursEnd?: string;   // e.g. "07:00"
  timezone: string;
}

export interface NotificationStatistics {
  tenantId: string;
  period: string; // YYYY-MM
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  deliveryRatePercentage: number;
}

export interface FailedNotification {
  notificationId: string;
  deliveryId: string;
  channel: string;
  failedAt: Date;
  reason: string;
  isRetryable: boolean;
}
