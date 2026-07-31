/**
 * Enterprise Webhook Platform - Hexagonal Domain Ports
 */

import { WebhookDeliveryAggregate } from '../models/webhook-delivery.aggregate';
import { WebhookSecretReference, WebhookSignature, WebhookPayload, WebhookId } from '../value-objects/webhook-vo';
import { SignatureType } from '../enums/webhook.enums';

export interface WebhookRepositoryPort {
  save(delivery: WebhookDeliveryAggregate): Promise<void>;
  findById(id: WebhookId): Promise<WebhookDeliveryAggregate | null>;
  findHistory(filters?: {
    tenantId?: string;
    connectorId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<WebhookDeliveryAggregate[]>;
}

export interface DeadLetterRepositoryPort {
  save(delivery: WebhookDeliveryAggregate): Promise<void>;
  findDeadLetters(filters?: {
    tenantId?: string;
    connectorId?: string;
    limit?: number;
    offset?: number;
  }): Promise<WebhookDeliveryAggregate[]>;
  remove(id: WebhookId): Promise<boolean>;
}

export interface NonceStorePort {
  hasNonce(nonce: string, connectorId: string): Promise<boolean>;
  storeNonce(nonce: string, connectorId: string, ttlMs?: number): Promise<void>;
}

export interface WebhookSecretResolverPort {
  resolveSecret(secretRef: WebhookSecretReference): Promise<string>;
}

export interface SignatureVerifierPort {
  verifySignature(
    payload: WebhookPayload,
    signature: WebhookSignature,
    secret: string
  ): Promise<boolean>;
}
