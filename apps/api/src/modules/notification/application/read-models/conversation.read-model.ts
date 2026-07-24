export interface OutgoingMessage {
  messageId: string;
  tenantId: string;
  channel: 'WHATSAPP' | 'TELEGRAM';
  recipientId: string; // Phone number or Chat ID
  messageType: 'TEXT' | 'TEMPLATE' | 'MEDIA' | 'INTERACTIVE';
  content: string | Record<string, any>;
  templateId?: string;
  mediaUrl?: string;
  status: 'QUEUED' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  createdAt: Date;
}

export interface IncomingWebhook {
  webhookId: string;
  providerName: 'WHATSAPP_CLOUD' | 'TELEGRAM_BOT';
  eventType: 'DELIVERY_RECEIPT' | 'READ_RECEIPT' | 'INBOUND_MESSAGE' | 'ERROR';
  payload: Record<string, any>;
  receivedAt: Date;
  processedAt?: Date;
  status: 'PENDING' | 'PROCESSED' | 'FAILED';
}

export interface DeliveryReceipt {
  receiptId: string;
  messageId: string;
  providerName: string;
  providerMessageId: string;
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  timestamp: Date;
}

export interface MessageAttempt {
  attemptId: string;
  messageId: string;
  providerName: string;
  status: 'SUCCESS' | 'FAILED';
  errorCode?: string;
  errorMessage?: string;
  attemptedAt: Date;
}

export interface ProviderHealth {
  providerName: string;
  isAvailable: boolean;
  latencyMs: number;
  errorRatePercentage: number;
  lastCheckedAt: Date;
}

export interface FailedMessage {
  messageId: string;
  providerName: string;
  failedAt: Date;
  errorCode: string;
  reason: string;
  isRetryable: boolean;
}
