/**
 * Enterprise Integration Event Bridge - Comprehensive Test Suite
 *
 * Tests Domain Value Objects, Event Envelope Canonical Wrapping, Correlation Tracking,
 * External-to-Internal Event Translation, Route Resolution, Replay Engine, and Platform Services.
 */

import {
  BridgeEventId,
  ExternalEventId,
  EventCorrelationId,
  EventMetadata,
  EventEnvelope,
  BridgeRoute,
  EventTranslation,
} from './domain/value-objects/bridge-vo';
import {
  EventSourceType,
  EventTargetType,
  BridgeStatus,
  TranslationResultEnum,
} from './domain/enums/bridge.enums';
import {
  TranslationException,
  BridgeEventNotFoundException,
} from './domain/exceptions/bridge.exceptions';
import { BridgeEventAggregate } from './domain/models/bridge-event.aggregate';
import {
  InMemoryBridgeRepository,
  InMemoryBridgeDLQRepository,
  InMemoryBridgeRouteRegistry,
} from './infrastructure/repositories/in-memory-bridge.repository';
import { NestEventPublisherAdapter } from './infrastructure/adapters/connector.adapters';
import {
  CorrelationService,
  TranslationService,
  RoutingService,
  PublicationService,
  DeadLetterService,
  IntegrationBridgePlatformService,
} from './application/services/bridge-platform.services';

describe('Enterprise Integration Event Bridge', () => {
  describe('Value Objects & Envelopes', () => {
    it('should create and validate EventMetadata and EventEnvelope', () => {
      const metadata = EventMetadata.create({
        tenantId: 'tenant-100',
        sourceType: EventSourceType.WEBHOOK,
        targetType: EventTargetType.INTEGRATION_EVENT,
      });

      expect(metadata.tenantId).toBe('tenant-100');
      expect(metadata.sourceType).toBe(EventSourceType.WEBHOOK);

      const envelope = EventEnvelope.create({
        eventName: 'OrderPlacedIntegrationEvent',
        metadata,
        payload: { orderId: 'ord-55' },
      });

      expect(envelope.eventName).toBe('OrderPlacedIntegrationEvent');
      expect(envelope.payload.orderId).toBe('ord-55');
    });
  });

  describe('BridgeEventAggregate Root', () => {
    it('should receive external event, translate, validate, and publish', () => {
      const aggregate = BridgeEventAggregate.receive({
        tenantId: 'tenant-1',
        connectorId: 'STRIPE_PAYMENT',
        sourceType: EventSourceType.WEBHOOK,
        rawPayload: { id: 'evt_stripe_1' },
      });

      expect(aggregate.getStatus()).toBe(BridgeStatus.RECEIVED);

      const route = BridgeRoute.create('charge.succeeded', 'integration.event.payment.succeeded');
      const translation = EventTranslation.success({ id: 'evt_stripe_1' }, { canonicalChargeId: 'ch_10' });

      aggregate.markTranslated(translation, route);
      expect(aggregate.getStatus()).toBe(BridgeStatus.TRANSLATED);
      expect(aggregate.getEnvelope()?.eventName).toBe('integration.event.payment.succeeded');

      aggregate.markValidated(true);
      expect(aggregate.getStatus()).toBe(BridgeStatus.VALIDATED);

      aggregate.markPublished('integration.event.payment.succeeded');
      expect(aggregate.getStatus()).toBe(BridgeStatus.PUBLISHED);
    });

    it('should route to DEAD_LETTER when maximum failure attempts are reached', () => {
      const aggregate = BridgeEventAggregate.receive({
        tenantId: 'tenant-1',
        connectorId: 'POS_TOAST',
        sourceType: EventSourceType.REST_API,
        rawPayload: {},
      });

      aggregate.recordFailure('Translation attempt 1 failed');
      aggregate.recordFailure('Translation attempt 2 failed');
      aggregate.recordFailure('Translation attempt 3 failed');

      expect(aggregate.getStatus()).toBe(BridgeStatus.DEAD_LETTER);
    });
  });

  describe('Services & End-to-End Bridge Pipeline', () => {
    let repo: InMemoryBridgeRepository;
    let dlqRepo: InMemoryBridgeDLQRepository;
    let routeRegistry: InMemoryBridgeRouteRegistry;
    let publisherAdapter: NestEventPublisherAdapter;

    let correlationService: CorrelationService;
    let translationService: TranslationService;
    let routingService: RoutingService;
    let publicationService: PublicationService;
    let dlqService: DeadLetterService;
    let bridgePlatformService: IntegrationBridgePlatformService;

    beforeEach(() => {
      repo = new InMemoryBridgeRepository();
      dlqRepo = new InMemoryBridgeDLQRepository();
      routeRegistry = new InMemoryBridgeRouteRegistry();
      publisherAdapter = new NestEventPublisherAdapter();

      correlationService = new CorrelationService();
      translationService = new TranslationService();
      routingService = new RoutingService(routeRegistry);
      publicationService = new PublicationService(publisherAdapter);
      dlqService = new DeadLetterService(dlqRepo, publisherAdapter);

      bridgePlatformService = new IntegrationBridgePlatformService(
        repo,
        correlationService,
        translationService,
        routingService,
        publicationService,
        dlqService
      );
    });

    it('should successfully ingest, translate, and publish external webhook event', async () => {
      const response = await bridgePlatformService.ingestExternalEvent('tenant-rest-1', {
        connectorId: 'UBEREATS_DELIVERY',
        sourceType: EventSourceType.WEBHOOK,
        sourceEventType: 'order_status_update',
        externalEventId: 'ext_ubereats_8891',
        payload: { order_id: 'ub-99', status: 'DISPATCHED' },
      });

      expect(response.status).toBe(BridgeStatus.PUBLISHED);
      expect(response.externalEventId).toBe('ext_ubereats_8891');
      expect(response.correlationId).toBeDefined();
    });

    it('should reject empty external payload with TranslationException', async () => {
      await expect(
        bridgePlatformService.ingestExternalEvent('tenant-rest-1', {
          connectorId: 'STRIPE',
          sourceType: EventSourceType.REST_API,
          sourceEventType: 'invalid_event',
          payload: {}, // empty payload
        })
      ).rejects.toThrow(TranslationException);
    });

    it('should replay a bridge event without side-effect duplication', async () => {
      const ingested = await bridgePlatformService.ingestExternalEvent('tenant-rest-1', {
        connectorId: 'TOAST_POS',
        sourceType: EventSourceType.POLLING,
        sourceEventType: 'item_sold',
        payload: { item_id: 'it-10' },
      });

      const replayed = await bridgePlatformService.replayEvent({
        bridgeEventId: ingested.bridgeEventId,
        requestedBy: 'operator-admin',
      });

      expect(replayed.isReplay).toBe(true);
      expect(replayed.status).toBe(BridgeStatus.PUBLISHED);
    });

    it('should query history, statistics, and dashboard metrics', async () => {
      await bridgePlatformService.ingestExternalEvent('tenant-rest-1', {
        connectorId: 'CRM_HUBSPOT',
        sourceType: EventSourceType.MESSAGE_QUEUE,
        sourceEventType: 'contact_updated',
        payload: { contact_id: 'c-5' },
      });

      const history = await bridgePlatformService.getHistory();
      expect(history.totalCount).toBe(1);

      const stats = await bridgePlatformService.getStatistics();
      expect(stats.totalEvents).toBe(1);

      const dashboard = await bridgePlatformService.getDashboard();
      expect(dashboard.totalIngested).toBe(1);
    });
  });
});
