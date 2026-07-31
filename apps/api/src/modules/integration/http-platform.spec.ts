/**
 * Enterprise HTTP & API Integration Platform - Comprehensive Test Suite
 *
 * Tests Domain Value Objects, Circuit Breaker State Machine, Retry Exponential Backoff,
 * Idempotency, Correlation Tracking, Rate Limiting, and HttpIntegrationService facade.
 */

import {
  RequestId,
  CorrelationId,
  IdempotencyKey,
  EndpointUrl,
  HttpMethod,
  RequestHeaders,
  RetryPolicy,
  ResponseBody,
} from './domain/value-objects/http-vo';
import { HttpMethodEnum, CircuitState, ProtocolType } from './domain/enums/http.enums';
import {
  CircuitBreakerOpenException,
  RateLimitExceededException,
  DuplicateIdempotentRequestException,
  InvalidHttpRequestException,
} from './domain/exceptions/http.exceptions';
import { CircuitBreakerAggregate } from './domain/models/circuit-breaker.aggregate';
import { OutboundRequestAggregate } from './domain/models/outbound-request.aggregate';
import {
  InMemoryCircuitBreakerRepository,
} from './infrastructure/repositories/in-memory-circuit-breaker.repository';
import {
  InMemoryRequestHistoryRepository,
  InMemoryIdempotencyRepository,
} from './infrastructure/repositories/in-memory-request-history.repository';
import {
  NodeHttpClientAdapter,
} from './infrastructure/adapters/http.adapters';
import { NestEventPublisherAdapter } from './infrastructure/adapters/connector.adapters';
import {
  CorrelationService,
  IdempotencyService,
  RateLimiterService,
  CircuitBreakerService,
  RetryPolicyService,
  HttpClientService,
  HttpIntegrationService,
} from './application/services/http-platform.services';

describe('Enterprise HTTP & API Integration Platform', () => {
  describe('Value Objects & Enums', () => {
    it('should validate EndpointUrl protocol', () => {
      const httpsUrl = EndpointUrl.create('https://api.stripe.com/v1/charges');
      expect(httpsUrl.isHttps()).toBe(true);

      const httpUrl = EndpointUrl.create('http://localhost:8080/health');
      expect(httpUrl.isHttps()).toBe(false);

      expect(() => EndpointUrl.create('ftp://invalid-url.com')).toThrow(InvalidHttpRequestException);
    });

    it('should sanitize sensitive headers in RequestHeaders', () => {
      const headers = RequestHeaders.create({
        'Authorization': 'Bearer secret_token_123',
        'X-Api-Key': 'key_abc_999',
        'Content-Type': 'application/json',
      });

      const masked = headers.getMaskedHeaders();
      expect(masked['authorization']).toBe('[REDACTED_SECRET]');
      expect(masked['x-api-key']).toBe('[REDACTED_SECRET]');
      expect(masked['content-type']).toBe('application/json');
    });

    it('should calculate exponential backoff delay with jitter in RetryPolicy', () => {
      const policy = RetryPolicy.create({
        maxAttempts: 3,
        initialDelayMs: 100,
        maxDelayMs: 1000,
        backoffMultiplier: 2.0,
        jitterRatio: 0.1,
      });

      const delay1 = policy.calculateBackoffDelay(1);
      const delay2 = policy.calculateBackoffDelay(2);

      expect(delay1).toBeGreaterThanOrEqual(90);
      expect(delay1).toBeLessThanOrEqual(110);
      expect(delay2).toBeGreaterThanOrEqual(180);
      expect(delay2).toBeLessThanOrEqual(220);
    });

    it('should identify mutating HTTP methods', () => {
      const post = HttpMethod.create(HttpMethodEnum.POST);
      expect(post.isMutating()).toBe(true);

      const get = HttpMethod.create(HttpMethodEnum.GET);
      expect(get.isMutating()).toBe(false);
    });
  });

  describe('CircuitBreakerAggregate (Per-Connector Isolation)', () => {
    it('should isolate circuit breaker states per connector ID', async () => {
      const breakerA = new CircuitBreakerAggregate('STRIPE_PAYMENT', 'tenant-1');
      const breakerB = new CircuitBreakerAggregate('UBEREATS_DELIVERY', 'tenant-1');

      // Trip breaker A by recording 10 failures
      for (let i = 0; i < 10; i++) {
        breakerA.recordFailure('Simulated 500 error');
      }

      expect(breakerA.getState()).toBe(CircuitState.OPEN);
      expect(() => breakerA.checkExecutionAllowed()).toThrow(CircuitBreakerOpenException);

      // Breaker B must remain CLOSED and unaffected
      expect(breakerB.getState()).toBe(CircuitState.CLOSED);
      expect(() => breakerB.checkExecutionAllowed()).not.toThrow();
    });

    it('should recover from OPEN to HALF_OPEN to CLOSED upon trial success', () => {
      const breaker = new CircuitBreakerAggregate('TOAST_POS', 'tenant-1');

      for (let i = 0; i < 10; i++) {
        breaker.recordFailure('Connection refused');
      }
      expect(breaker.getState()).toBe(CircuitState.OPEN);

      // Simulate clock advancement past reset timeout
      (breaker as any).openedAt = new Date(Date.now() - 35000); // 35s ago (> 30s default reset)
      expect(breaker.getState()).toBe(CircuitState.HALF_OPEN);

      // Record 5 successful trials
      for (let i = 0; i < 5; i++) {
        breaker.recordSuccess();
      }

      expect(breaker.getState()).toBe(CircuitState.CLOSED);
    });
  });

  describe('Services & End-to-End Execution Pipeline', () => {
    let historyRepo: InMemoryRequestHistoryRepository;
    let circuitRepo: InMemoryCircuitBreakerRepository;
    let idempotencyRepo: InMemoryIdempotencyRepository;
    let eventPublisher: NestEventPublisherAdapter;
    let httpAdapter: NodeHttpClientAdapter;

    let correlationService: CorrelationService;
    let idempotencyService: IdempotencyService;
    let rateLimiterService: RateLimiterService;
    let circuitBreakerService: CircuitBreakerService;
    let retryPolicyService: RetryPolicyService;
    let httpClientService: HttpClientService;
    let httpIntegrationService: HttpIntegrationService;

    beforeEach(() => {
      historyRepo = new InMemoryRequestHistoryRepository();
      circuitRepo = new InMemoryCircuitBreakerRepository();
      idempotencyRepo = new InMemoryIdempotencyRepository();
      eventPublisher = new NestEventPublisherAdapter();
      httpAdapter = new NodeHttpClientAdapter();

      correlationService = new CorrelationService();
      idempotencyService = new IdempotencyService(idempotencyRepo);
      rateLimiterService = new RateLimiterService();
      circuitBreakerService = new CircuitBreakerService(circuitRepo, eventPublisher);
      retryPolicyService = new RetryPolicyService();
      httpClientService = new HttpClientService(httpAdapter);

      httpIntegrationService = new HttpIntegrationService(
        correlationService,
        idempotencyService,
        rateLimiterService,
        circuitBreakerService,
        retryPolicyService,
        httpClientService,
        historyRepo,
        eventPublisher
      );
    });

    it('should inject x-correlation-id and execute successful HTTP request', async () => {
      const response = await httpIntegrationService.executeRequest('tenant-1', {
        connectorId: 'STRIPE_PAYMENT',
        endpointUrl: 'https://api.stripe.com/v1/charges',
        method: HttpMethodEnum.POST,
        body: { amount: 2500, currency: 'usd' },
      });

      expect(response.status).toBe('SUCCEEDED');
      expect(response.statusCode).toBe(200);
      expect(response.correlationId).toBeDefined();
      expect(response.correlationId).toMatch(/^corr_/);
    });

    it('should reject duplicate requests with identical Idempotency-Key', async () => {
      const key = 'idemp_key_unique_888';

      // First call succeeds
      await httpIntegrationService.executeRequest('tenant-1', {
        connectorId: 'STRIPE_PAYMENT',
        endpointUrl: 'https://api.stripe.com/v1/charges',
        method: HttpMethodEnum.POST,
        idempotencyKey: key,
        body: { amount: 1000 },
      });

      // Second duplicate call throws DuplicateIdempotentRequestException
      await expect(
        httpIntegrationService.executeRequest('tenant-1', {
          connectorId: 'STRIPE_PAYMENT',
          endpointUrl: 'https://api.stripe.com/v1/charges',
          method: HttpMethodEnum.POST,
          idempotencyKey: key,
          body: { amount: 1000 },
        })
      ).rejects.toThrow(DuplicateIdempotentRequestException);
    });

    it('should query latency statistics (P50/P95/P99) and request history', async () => {
      for (let i = 0; i < 5; i++) {
        await httpIntegrationService.executeRequest('tenant-1', {
          connectorId: 'UBEREATS_DELIVERY',
          endpointUrl: 'https://api.ubereats.com/v1/orders',
          method: HttpMethodEnum.GET,
        });
      }

      const history = await httpIntegrationService.getHistory({ connectorId: 'UBEREATS_DELIVERY' });
      expect(history.totalCount).toBe(5);

      const stats = await httpIntegrationService.getLatencyStatistics('UBEREATS_DELIVERY');
      expect(stats.sampleSize).toBe(5);
      expect(stats.p50Ms).toBeGreaterThan(0);
    });
  });
});
