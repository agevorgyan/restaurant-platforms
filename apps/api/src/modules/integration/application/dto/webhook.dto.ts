/**
 * Enterprise Webhook Platform - Application DTOs
 */

import { WebhookType, SignatureType, WebhookStatus } from '../../domain/enums/webhook.enums';

export interface IngestWebhookDto {
  connectorId: string;
  endpointPath: string;
  rawPayload: string | Buffer | object;
  headers: Record<string, string | string[] | undefined>;
  signatureStr?: string;
  signatureType?: SignatureType;
  timestampHeader?: string | number;
  nonceHeader?: string;
  secretArn?: string;
  secretKeyRef?: string;
}

export interface WebhookResponseDto {
  deliveryId: string;
  webhookId: string;
  connectorId: string;
  tenantId: string;
  type: WebhookType;
  status: WebhookStatus;
  signatureStatus: string;
  attemptCount: number;
  errorDetails?: string;
  eventTopic?: string;
  receivedAt: Date;
}

export interface ReplayWebhookDto {
  webhookId: string;
  tenantId?: string;
}

export interface WebhookQueryDto {
  tenantId?: string;
  connectorId?: string;
  status?: WebhookStatus;
  limit?: number;
  offset?: number;
}
