export interface PushMessage {
  pushId: string;
  tenantId: string;
  recipientToken?: string;
  topic?: string;
  title?: string;
  body?: string;
  dataPayload?: Record<string, any>;
  badge?: number;
  sound?: string;
  priority: 'NORMAL' | 'HIGH';
  status: 'QUEUED' | 'SENDING' | 'DELIVERED' | 'FAILED' | 'UNREGISTERED';
  createdAt: Date;
}

export interface PushDelivery {
  deliveryId: string;
  pushId: string;
  providerName: 'FCM' | 'APNS' | 'WEB_PUSH' | 'AZURE' | 'AWS_SNS';
  providerMessageId?: string;
  dispatchedAt: Date;
  deliveredAt?: Date;
}

export interface PushAttempt {
  attemptId: string;
  pushId: string;
  providerName: string;
  status: 'SUCCESS' | 'FAILED';
  errorCode?: string;
  errorMessage?: string;
  attemptedAt: Date;
}

export interface PushStatistics {
  tenantId: string;
  period: string; // YYYY-MM
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  totalUnregistered: number;
  deliveryRatePercentage: number;
  averageLatencyMs: number;
}

export interface ProviderHealth {
  providerName: string;
  isAvailable: boolean;
  latencyMs: number;
  errorRatePercentage: number;
  lastCheckedAt: Date;
}

export interface RegisteredDevice {
  deviceId: string;
  userId: string;
  tenantId: string;
  token: string;
  platform: 'IOS' | 'ANDROID' | 'WEB' | 'DESKTOP';
  appVersion?: string;
  isActive: boolean;
  registeredAt: Date;
  lastActiveAt: Date;
}
