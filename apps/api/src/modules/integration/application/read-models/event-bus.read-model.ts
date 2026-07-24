export interface EventEnvelope {
  eventId: string;
  eventName: string;
  eventType: string;
  eventVersion: string;
  source: string;
  timestamp: Date;
  correlationId?: string;
  causationId?: string;
  payload: any;
  messageKey?: string;
}

export interface EventSubscription {
  subscriptionId: string;
  subscriberId: string;
  topicPattern: string;
  queueName: string;
  isActive: boolean;
  createdAt: Date;
}

export interface EventPublication {
  publicationId: string;
  eventId: string;
  topic: string;
  status: string;
  publishedAt: Date;
}

export interface DeliveryStatus {
  deliveryId: string;
  eventId: string;
  subscriptionId: string;
  status: 'PENDING' | 'DELIVERED' | 'FAILED' | 'RETRYING' | 'DEAD_LETTERED';
  attempts: number;
  lastAttemptAt?: Date;
  errorReason?: string;
}

export interface ConsumerHealth {
  subscriberId: string;
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  queueDepth: number;
  processingRatePerSecond: number;
  lastHeartbeatAt: Date;
}

export interface DeadLetterMessage {
  deadLetterId: string;
  eventId: string;
  subscriptionId: string;
  failedAt: Date;
  reason: string;
  envelope: EventEnvelope;
  retryCount: number;
}
