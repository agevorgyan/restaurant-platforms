/**
 * Enterprise Webhook Platform - CQRS Read Models
 */

import { WebhookStatus, SignatureStatus, WebhookType } from '../../domain/enums/webhook.enums';

export interface WebhookHistoryItem {
  deliveryId: string;
  webhookId: string;
  tenantId: string;
  connectorId: string;
  type: WebhookType;
  endpointPath: string;
  status: WebhookStatus;
  signatureStatus: SignatureStatus;
  attemptCount: number;
  errorDetails?: string;
  timestamp: Date;
}

export interface WebhookHistory {
  totalCount: number;
  items: WebhookHistoryItem[];
}

export interface WebhookStatistics {
  totalReceived: number;
  totalValidated: number;
  totalProcessed: number;
  totalRejected: number;
  totalDeadLettered: number;
  byType: Record<WebhookType, number>;
  byStatus: Record<WebhookStatus, number>;
  averageProcessingTimeMs: number;
}

export interface DeadLetterItem {
  webhookId: string;
  tenantId: string;
  connectorId: string;
  type: WebhookType;
  totalAttempts: number;
  failureReason: string;
  deadLetteredAt: Date;
  rawPayloadSample: string;
}

export interface DeadLetterQueue {
  totalCount: number;
  deadLetters: DeadLetterItem[];
}

export interface SignatureFailures {
  totalFailures: number;
  missingSignatureCount: number;
  invalidSignatureCount: number;
  expiredSignatureCount: number;
  byConnector: Record<string, number>;
}

export interface ReplayAttempts {
  totalBlocked: number;
  timestampOutofBoundsCount: number;
  duplicateNonceCount: number;
  recentAttempts: {
    connectorId: string;
    nonce: string;
    reason: string;
    timestamp: Date;
  }[];
}

export interface DeliveryMetrics {
  ingestionSuccessRate: number; // 0.0 to 1.0
  averageValidationTimeMs: number;
  retrySuccessRate: number;
  byConnector: Record<string, { received: number; processed: number; failed: number }>;
}
