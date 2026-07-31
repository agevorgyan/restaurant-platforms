/**
 * Enterprise Webhook Platform - Comprehensive Test Suite
 *
 * Tests Domain Value Objects, Constant-Time Signature Verification,
 * Replay Attack Protection, Webhook Delivery Lifecycle, Dead Letter Queue (DLQ), and Ingestion Pipeline.
 */

import { createHmac } from 'crypto';
import {
  WebhookId,
  WebhookEndpoint,
  WebhookPayload,
  WebhookTimestamp,
  WebhookNonce,
  ReplayWindow,
  WebhookSignature,
} from './domain/value-objects/webhook-vo';
import { SignatureType, WebhookStatus, SignatureStatus, WebhookType } from './domain/enums/webhook.enums';
import {
  InvalidSignatureException,
  ReplayAttackException,
  WebhookRejectedException,
  DeadLetterQueueException,
} from './domain/exceptions/webhook.exceptions';
import { WebhookDeliveryAggregate } from './domain/models/webhook-delivery.aggregate';
import {
  InMemoryWebhookRepository,
  InMemoryDeadLetterRepository,
  InMemoryNonceStore,
} from './infrastructure/repositories/in-memory-webhook.repository';
import {
  HmacSignatureVerifierAdapter,
  EnterpriseWebhookSecretResolverAdapter,
} from './infrastructure/adapters/webhook-verifier.adapters';
import { NestEventPublisherAdapter } from './infrastructure/adapters/connector.adapters';
import {
  SignatureVerificationService,
  ReplayProtectionService,
  RoutingService,
  WebhookPublicationService,
  DeadLetterService,
  WebhookPlatformService,
} from './application/services/webhook-platform.services';

describe('Enterprise Webhook Platform', () => {
  const TEST_SECRET = 'ENTERPRISE_WEBHOOK_SECRET_KEY_33.3';

  describe('Value Objects & Replay Protection', () => {
    it('should create and validate WebhookEndpoint and WebhookPayload', () => {
      const endpoint = WebhookEndpoint.create('/integrations/webhooks/stripe');
      expect(endpoint.getValue()).toBe('/integrations/webhooks/stripe');

      const payload = WebhookPayload.create({ event: 'payment_intent.succeeded', amount: 5000 });
      expect(payload.getRawPayload()).toContain('payment_intent.succeeded');
      expect(payload.parseJson().event).toBe('payment_intent.succeeded');

      expect(() => WebhookEndpoint.create('invalid-path-without-slash')).toThrow(WebhookRejectedException);
    });

    it('should validate timestamp within ReplayWindow and reject expired timestamp', () => {
      const window = ReplayWindow.default(); // 5 minutes max skew

      const currentTimestamp = WebhookTimestamp.create(Date.now());
      expect(() => window.validateTimestamp(currentTimestamp)).not.toThrow();

      // Timestamp from 10 minutes ago
      const expiredTimestamp = WebhookTimestamp.create(Date.now() - 600000);
      expect(() => window.validateTimestamp(expiredTimestamp)).toThrow(ReplayAttackException);
    });
  });

  describe('Constant-Time Cryptographic Signature Verification', () => {
    let verifier: HmacSignatureVerifierAdapter;

    beforeEach(() => {
      verifier = new HmacSignatureVerifierAdapter();
    });

    it('should verify valid HMAC-SHA256 signature using constant-time comparison', async () => {
      const payloadStr = JSON.stringify({ action: 'order_created', orderId: 'ord-1001' });
      const payload = WebhookPayload.create(payloadStr);

      const validHmac = createHmac('sha256', TEST_SECRET).update(payloadStr).digest('hex');
      const signature = WebhookSignature.create(`sha256=${validHmac}`, SignatureType.HMAC_SHA256);

      const isValid = await verifier.verifySignature(payload, signature, TEST_SECRET);
      expect(isValid).toBe(true);
    });

    it('should reject invalid HMAC-SHA256 signature', async () => {
      const payload = WebhookPayload.create(JSON.stringify({ action: 'order_created' }));
      const invalidSignature = WebhookSignature.create('sha256=invalid_tampered_signature_hex_value_1234567890abcdef', SignatureType.HMAC_SHA256);

      const isValid = await verifier.verifySignature(payload, invalidSignature, TEST_SECRET);
      expect(isValid).toBe(false);
    });
  });

  describe('WebhookDeliveryAggregate Root', () => {
    it('should receive raw webhook and transition state on verification & processing', () => {
      const delivery = WebhookDeliveryAggregate.receive({
        connectorId: 'STRIPE_PAYMENT',
        endpointPath: '/integrations/webhooks/stripe',
        rawPayload: { type: 'charge.succeeded' },
        headers: { 'x-signature': 'sha256=abc' },
        signatureStr: 'sha256=abc',
      });

      expect(delivery.getStatus()).toBe(WebhookStatus.RECEIVED);

      delivery.markSignatureVerified(true);
      expect(delivery.getStatus()).toBe(WebhookStatus.VALIDATED);
      expect(delivery.getSignatureStatus()).toBe(SignatureStatus.VALID);

      delivery.markProcessing();
      expect(delivery.getStatus()).toBe(WebhookStatus.PROCESSING);

      delivery.markProcessed(25, 'integration.events.payment.webhook');
      expect(delivery.getStatus()).toBe(WebhookStatus.PROCESSED);
    });

    it('should route failing webhook to DEAD_LETTER when retry attempts expire', () => {
      const delivery = WebhookDeliveryAggregate.receive({
        connectorId: 'UBEREATS_DELIVERY',
        endpointPath: '/integrations/webhooks/ubereats',
        rawPayload: { order: 'del-900' },
        headers: {},
      });

      for (let i = 0; i < 5; i++) {
        delivery.markProcessing();
        delivery.recordFailure('Simulated processing exception');
      }

      expect(delivery.getStatus()).toBe(WebhookStatus.DEAD_LETTER);
    });
  });

  describe('Services & End-to-End Ingestion Pipeline', () => {
    let repo: InMemoryWebhookRepository;
    let dlqRepo: InMemoryDeadLetterRepository;
    let nonceStore: InMemoryNonceStore;
    let verifierAdapter: HmacSignatureVerifierAdapter;
    let secretAdapter: EnterpriseWebhookSecretResolverAdapter;
    let publisherAdapter: NestEventPublisherAdapter;

    let signatureService: SignatureVerificationService;
    let replayService: ReplayProtectionService;
    let routingService: RoutingService;
    let publicationService: WebhookPublicationService;
    let dlqService: DeadLetterService;
    let webhookPlatformService: WebhookPlatformService;

    beforeEach(() => {
      repo = new InMemoryWebhookRepository();
      dlqRepo = new InMemoryDeadLetterRepository();
      nonceStore = new InMemoryNonceStore();
      verifierAdapter = new HmacSignatureVerifierAdapter();
      secretAdapter = new EnterpriseWebhookSecretResolverAdapter();
      publisherAdapter = new NestEventPublisherAdapter();

      signatureService = new SignatureVerificationService(verifierAdapter, secretAdapter);
      replayService = new ReplayProtectionService(nonceStore);
      routingService = new RoutingService();
      publicationService = new WebhookPublicationService(publisherAdapter);
      dlqService = new DeadLetterService(dlqRepo, publisherAdapter);

      webhookPlatformService = new WebhookPlatformService(
        signatureService,
        replayService,
        routingService,
        publicationService,
        dlqService,
        repo
      );
    });

    it('should successfully ingest, verify, and process valid inbound webhook', async () => {
      const payloadObj = { event: 'delivery_status_updated', orderId: 'ub-88' };
      const rawPayloadStr = JSON.stringify(payloadObj);
      const validHmac = createHmac('sha256', TEST_SECRET).update(rawPayloadStr).digest('hex');

      const response = await webhookPlatformService.ingestWebhook({
        connectorId: 'UBEREATS_DELIVERY',
        endpointPath: '/integrations/webhooks/ubereats',
        rawPayload: payloadObj,
        headers: { 'x-signature': `sha256=${validHmac}` },
        signatureStr: `sha256=${validHmac}`,
        timestampHeader: Date.now(),
        nonceHeader: 'nonce_unique_1001',
      });

      expect(response.status).toBe(WebhookStatus.PROCESSED);
      expect(response.signatureStatus).toBe(SignatureStatus.VALID);
      expect(response.deliveryId).toBeDefined();
    });

    it('should reject webhook with invalid signature before processing payload', async () => {
      const payloadObj = { event: 'suspicious_payload' };

      await expect(
        webhookPlatformService.ingestWebhook({
          connectorId: 'STRIPE_PAYMENT',
          endpointPath: '/integrations/webhooks/stripe',
          rawPayload: payloadObj,
          headers: {},
          signatureStr: 'sha256=invalid_signature_hex_value_00000',
        })
      ).rejects.toThrow(InvalidSignatureException);
    });

    it('should detect and reject duplicate replay attack nonces', async () => {
      const payloadObj = { event: 'ping' };
      const rawPayloadStr = JSON.stringify(payloadObj);
      const validHmac = createHmac('sha256', TEST_SECRET).update(rawPayloadStr).digest('hex');
      const duplicateNonce = 'nonce_replay_attack_key_555';

      // First submission succeeds
      await webhookPlatformService.ingestWebhook({
        connectorId: 'TOAST_POS',
        endpointPath: '/integrations/webhooks/toast',
        rawPayload: payloadObj,
        headers: {},
        signatureStr: `sha256=${validHmac}`,
        nonceHeader: duplicateNonce,
      });

      // Second submission with same nonce throws ReplayAttackException
      await expect(
        webhookPlatformService.ingestWebhook({
          connectorId: 'TOAST_POS',
          endpointPath: '/integrations/webhooks/toast',
          rawPayload: payloadObj,
          headers: {},
          signatureStr: `sha256=${validHmac}`,
          nonceHeader: duplicateNonce,
        })
      ).rejects.toThrow(ReplayAttackException);
    });

    it('should query history and statistics metrics', async () => {
      const payloadObj = { ping: true };
      const rawPayloadStr = JSON.stringify(payloadObj);
      const validHmac = createHmac('sha256', TEST_SECRET).update(rawPayloadStr).digest('hex');

      await webhookPlatformService.ingestWebhook({
        connectorId: 'CRM_HUB_SPOT',
        endpointPath: '/integrations/webhooks/hubspot',
        rawPayload: payloadObj,
        headers: {},
        signatureStr: `sha256=${validHmac}`,
      });

      const history = await webhookPlatformService.getHistory();
      expect(history.totalCount).toBe(1);

      const stats = await webhookPlatformService.getStatistics();
      expect(stats.totalProcessed).toBe(1);
    });
  });
});
