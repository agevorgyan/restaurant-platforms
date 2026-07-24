export interface WebhookSubscription {
  subscriptionId: string;
  tenantId: string;
  endpointUrl: string;
  subscribedEvents: string[];
  secretHash: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookDelivery {
  deliveryId: string;
  subscriptionId: string;
  eventId: string;
  payload: any;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'DEAD_LETTERED';
  nextAttemptAt?: Date;
  completedAt?: Date;
}

export interface WebhookAttempt {
  attemptId: string;
  deliveryId: string;
  attemptNumber: number;
  httpStatusCode?: number;
  responseBody?: string;
  errorMessage?: string;
  durationMs: number;
  executedAt: Date;
}

export interface WebhookHealth {
  subscriptionId: string;
  endpointUrl: string;
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  consecutiveFailures: number;
  lastSuccessAt?: Date;
  lastFailureAt?: Date;
}

export interface WebhookStatistics {
  tenantId: string;
  totalDeliveries24h: number;
  successfulDeliveries24h: number;
  failedDeliveries24h: number;
  averageLatencyMs: number;
}

export interface FailedWebhook {
  deadLetterId: string;
  deliveryId: string;
  subscriptionId: string;
  failedAt: Date;
  reason: string;
  finalAttempt: WebhookAttempt;
}
