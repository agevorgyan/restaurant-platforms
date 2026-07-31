/**
 * Enterprise HTTP & API Integration Platform - Services
 *
 * Implementation of core application services:
 * 1. HttpClientService
 * 2. GraphQLClientService
 * 3. GrpcClientService
 * 4. RetryPolicyService
 * 5. CircuitBreakerService
 * 6. RateLimiterService
 * 7. IdempotencyService
 * 8. CorrelationService
 * 9. HttpIntegrationService
 */

import { Injectable, Inject, Logger } from '@nestjs/common';
import { OutboundRequestAggregate } from '../../domain/models/outbound-request.aggregate';
import { CircuitBreakerAggregate } from '../../domain/models/circuit-breaker.aggregate';
import {
  CorrelationId,
  ResponseBody,
  RetryPolicy,
  RateLimitPolicy,
} from '../../domain/value-objects/http-vo';
import { ProtocolType, RequestStatus } from '../../domain/enums/http.enums';
import {
  HttpClientPort,
  GraphQLClientPort,
  GrpcClientPort,
  CircuitBreakerRepositoryPort,
  IdempotencyRepositoryPort,
  RequestHistoryRepositoryPort,
} from '../../domain/ports/http.ports';
import { EVENT_PUBLISHER_TOKEN } from './connector-platform.services';
import { EventPublisherPort } from '../../domain/ports/connector.ports';
import {
  ExecuteHttpRequestDto,
  OutboundResponseDto,
  TestOutboundRequestDto,
  HttpQueryDto,
} from '../dto/http.dto';
import {
  RequestHistory,
  CircuitBreakerDashboard,
  RateLimitDashboard,
  ApiLatencyStatistics,
  FailureStatistics,
  ConnectorTraffic,
  RateLimitStatus,
} from '../read-models/http.read-models';
import {
  CircuitBreakerOpenException,
  RateLimitExceededException,
  DuplicateIdempotentRequestException,
  RequestTimeoutException,
} from '../../domain/exceptions/http.exceptions';
import { RateLimitExceededEvent } from '../../domain/events/http.events';

export const HTTP_CLIENT_PORT_TOKEN = 'HttpClientPort';
export const GRAPHQL_CLIENT_PORT_TOKEN = 'GraphQLClientPort';
export const GRPC_CLIENT_PORT_TOKEN = 'GrpcClientPort';
export const CIRCUIT_BREAKER_REPOSITORY_TOKEN = 'CircuitBreakerRepositoryPort';
export const IDEMPOTENCY_REPOSITORY_TOKEN = 'IdempotencyRepositoryPort';
export const REQUEST_HISTORY_REPOSITORY_TOKEN = 'RequestHistoryRepositoryPort';

/**
 * Service 1: CorrelationService
 * Handles request correlation ID generation and propagation across headers.
 */
@Injectable()
export class CorrelationService {
  public getOrCreateCorrelationId(existingCorrelationId?: string): CorrelationId {
    return CorrelationId.create(existingCorrelationId);
  }
}

/**
 * Service 2: IdempotencyService
 * Enforces deduplication for mutating requests with an Idempotency-Key.
 */
@Injectable()
export class IdempotencyService {
  constructor(
    @Inject(IDEMPOTENCY_REPOSITORY_TOKEN)
    private readonly repo: IdempotencyRepositoryPort
  ) {}

  public async checkAndReserveKey(idempotencyKey?: string, requestId?: string): Promise<void> {
    if (!idempotencyKey || !requestId) return;

    const exists = await this.repo.hasKey(idempotencyKey);
    if (exists) {
      throw new DuplicateIdempotentRequestException(idempotencyKey);
    }

    await this.repo.storeKey(idempotencyKey, requestId, 86400000); // 24hr TTL
  }
}

/**
 * Service 3: RateLimiterService
 * Sliding window rate limit calculation per connector.
 */
@Injectable()
export class RateLimiterService {
  private readonly usageMap = new Map<string, { timestamps: number[] }>();

  public checkRateLimit(
    connectorId: string,
    tenantId: string,
    policy: RateLimitPolicy = RateLimitPolicy.default()
  ): { isAllowed: boolean; remainingCapacity: number; resetsInMs: number } {
    const now = Date.now();
    const windowStart = now - policy.windowSizeMs;
    const key = `${tenantId}:${connectorId}`;

    const usage = this.usageMap.get(key) || { timestamps: [] };
    // Filter timestamps within sliding window
    usage.timestamps = usage.timestamps.filter(ts => ts > windowStart);

    if (usage.timestamps.length >= policy.burstLimit) {
      const oldestInWindow = usage.timestamps[0];
      const resetsInMs = oldestInWindow ? oldestInWindow + policy.windowSizeMs - now : policy.windowSizeMs;
      this.usageMap.set(key, usage);
      return { isAllowed: false, remainingCapacity: 0, resetsInMs };
    }

    usage.timestamps.push(now);
    this.usageMap.set(key, usage);

    const remainingCapacity = policy.burstLimit - usage.timestamps.length;
    return { isAllowed: true, remainingCapacity, resetsInMs: policy.windowSizeMs };
  }

  public getStatus(connectorId: string, tenantId: string, policy: RateLimitPolicy = RateLimitPolicy.default()): RateLimitStatus {
    const now = Date.now();
    const windowStart = now - policy.windowSizeMs;
    const key = `${tenantId}:${connectorId}`;

    const usage = this.usageMap.get(key) || { timestamps: [] };
    const validTimestamps = usage.timestamps.filter(ts => ts > windowStart);
    const usageCount = validTimestamps.length;
    const isExceeded = usageCount >= policy.burstLimit;
    const oldestInWindow = validTimestamps[0];
    const resetsInMs = oldestInWindow ? oldestInWindow + policy.windowSizeMs - now : 0;

    return {
      connectorId,
      tenantId,
      requestsPerWindow: policy.requestsPerWindow,
      windowSizeMs: policy.windowSizeMs,
      currentWindowUsage: usageCount,
      remainingCapacity: Math.max(0, policy.burstLimit - usageCount),
      isExceeded,
      resetsInMs: Math.max(0, resetsInMs),
    };
  }
}

/**
 * Service 4: CircuitBreakerService
 * Manages per-connector circuit breaker aggregates ("One Circuit Breaker per Connector").
 */
@Injectable()
export class CircuitBreakerService {
  constructor(
    @Inject(CIRCUIT_BREAKER_REPOSITORY_TOKEN)
    private readonly repo: CircuitBreakerRepositoryPort,
    @Inject(EVENT_PUBLISHER_TOKEN)
    private readonly eventPublisher: EventPublisherPort
  ) {}

  public async getBreaker(connectorId: string, tenantId?: string): Promise<CircuitBreakerAggregate> {
    return this.repo.getBreaker(connectorId, tenantId);
  }

  public async checkExecutionAllowed(connectorId: string, tenantId?: string): Promise<void> {
    const breaker = await this.getBreaker(connectorId, tenantId);
    breaker.checkExecutionAllowed();
  }

  public async recordSuccess(connectorId: string, tenantId?: string): Promise<void> {
    const breaker = await this.getBreaker(connectorId, tenantId);
    breaker.recordSuccess();
    await this.repo.saveBreaker(breaker);
    await this.eventPublisher.publishAll(breaker.getUncommittedEvents());
    breaker.clearEvents();
  }

  public async recordFailure(connectorId: string, tenantId?: string, reason?: string): Promise<void> {
    const breaker = await this.getBreaker(connectorId, tenantId);
    breaker.recordFailure(reason);
    await this.repo.saveBreaker(breaker);
    await this.eventPublisher.publishAll(breaker.getUncommittedEvents());
    breaker.clearEvents();
  }

  public async getDashboard(tenantId?: string): Promise<CircuitBreakerDashboard> {
    const breakers = await this.repo.getAllBreakers(tenantId);
    let closedCount = 0;
    let openCount = 0;
    let halfOpenCount = 0;

    const items = breakers.map(b => {
      const stats = b.getStats();
      if (stats.state === 'CLOSED') closedCount++;
      else if (stats.state === 'OPEN') openCount++;
      else if (stats.state === 'HALF_OPEN') halfOpenCount++;

      return {
        connectorId: b.getConnectorId(),
        tenantId: b.tenantId,
        state: stats.state,
        successCount: stats.successCount,
        failureCount: stats.failureCount,
        totalRequests: stats.totalRequests,
        failureRatePct: stats.failureRatePct,
        lastStateChangeAt: stats.lastStateChangeAt,
      };
    });

    return {
      closedCount,
      openCount,
      halfOpenCount,
      circuits: items,
    };
  }
}

/**
 * Service 5: RetryPolicyService
 * Calculates exponential backoff delays with random jitter ratio.
 */
@Injectable()
export class RetryPolicyService {
  public calculateDelay(policy: RetryPolicy, attempt: number): number {
    return policy.calculateBackoffDelay(attempt);
  }

  public async wait(delayMs: number): Promise<void> {
    if (delayMs <= 0) return;
    return new Promise(resolve => setTimeout(resolve, delayMs));
  }
}

/**
 * Service 6: HttpClientService
 * Executes REST/HTTP outbound communication with full resilience pipeline.
 */
@Injectable()
export class HttpClientService {
  constructor(
    @Inject(HTTP_CLIENT_PORT_TOKEN)
    private readonly clientPort: HttpClientPort
  ) {}

  public async execute(request: OutboundRequestAggregate): Promise<ResponseBody> {
    return this.clientPort.executeHttpRequest(request);
  }
}

/**
 * Service 7: GraphQLClientService
 * Executes GraphQL queries and mutations over HTTP with resilience.
 */
@Injectable()
export class GraphQLClientService {
  constructor(
    @Inject(GRAPHQL_CLIENT_PORT_TOKEN)
    private readonly graphqlPort: GraphQLClientPort
  ) {}

  public async execute(request: OutboundRequestAggregate, query: string, variables?: Record<string, unknown>): Promise<ResponseBody> {
    return this.graphqlPort.executeGraphQLQuery(request, query, variables);
  }
}

/**
 * Service 8: GrpcClientService
 * Executes gRPC calls with resilience.
 */
@Injectable()
export class GrpcClientService {
  constructor(
    @Inject(GRPC_CLIENT_PORT_TOKEN)
    private readonly grpcPort: GrpcClientPort
  ) {}

  public async execute(request: OutboundRequestAggregate, serviceName: string, methodName: string, payload: unknown): Promise<ResponseBody> {
    return this.grpcPort.executeGrpcCall(request, serviceName, methodName, payload);
  }
}

/**
 * Service 9: HttpIntegrationService
 * Unified application facade orchestrating the complete resilience pipeline & CQRS read models.
 */
@Injectable()
export class HttpIntegrationService {
  private readonly logger = new Logger(HttpIntegrationService.name);

  constructor(
    private readonly correlationService: CorrelationService,
    private readonly idempotencyService: IdempotencyService,
    private readonly rateLimiterService: RateLimiterService,
    private readonly circuitBreakerService: CircuitBreakerService,
    private readonly retryPolicyService: RetryPolicyService,
    private readonly httpClientService: HttpClientService,
    @Inject(REQUEST_HISTORY_REPOSITORY_TOKEN)
    private readonly historyRepo: RequestHistoryRepositoryPort,
    @Inject(EVENT_PUBLISHER_TOKEN)
    private readonly eventPublisher: EventPublisherPort
  ) {}

  public async executeRequest(tenantId: string, dto: ExecuteHttpRequestDto): Promise<OutboundResponseDto> {
    // 1. Correlation ID
    const correlationId = this.correlationService.getOrCreateCorrelationId(dto.correlationId);

    // 2. Aggregate Request creation
    const request = OutboundRequestAggregate.create({
      tenantId,
      connectorId: dto.connectorId,
      protocol: dto.protocol || ProtocolType.REST,
      endpointUrl: dto.endpointUrl,
      method: dto.method,
      headers: dto.headers,
      body: dto.body,
      correlationId: correlationId.getValue(),
      idempotencyKey: dto.idempotencyKey,
      timeoutMs: dto.timeoutMs,
      maxRetryAttempts: dto.maxRetryAttempts,
    });

    await this.eventPublisher.publishAll(request.getUncommittedEvents());
    request.clearEvents();

    // 3. Idempotency Check for mutating requests
    if (dto.idempotencyKey && request.getMethod().isMutating()) {
      await this.idempotencyService.checkAndReserveKey(dto.idempotencyKey, request.getId().getValue());
    }

    // 4. Rate Limiting Check
    const rateLimit = this.rateLimiterService.checkRateLimit(dto.connectorId, tenantId);
    if (!rateLimit.isAllowed) {
      await this.eventPublisher.publish(
        new RateLimitExceededEvent(request.getId().getValue(), tenantId, dto.connectorId, 100, 60000)
      );
      throw new RateLimitExceededException(dto.connectorId, 100, 60000);
    }

    // 5. Circuit Breaker Check
    await this.circuitBreakerService.checkExecutionAllowed(dto.connectorId, tenantId);

    // 6. Execution Loop with Retry & Exponential Backoff + Jitter
    const retryPolicy = request.getRetryPolicy();
    let response: ResponseBody | undefined;
    let lastError: Error | undefined;

    while (request.getAttemptCount() <= retryPolicy.maxAttempts) {
      request.markSending();
      await this.eventPublisher.publishAll(request.getUncommittedEvents());
      request.clearEvents();

      try {
        response = await this.httpClientService.execute(request);

        if (response.isSuccess()) {
          request.recordSuccess(response);
          await this.circuitBreakerService.recordSuccess(dto.connectorId, tenantId);
          await this.historyRepo.saveRequest(request);
          await this.eventPublisher.publishAll(request.getUncommittedEvents());
          request.clearEvents();

          return this.toResponseDto(request);
        }

        // Handle Server Errors (5xx) with Retry
        if (response.isServerError()) {
          const reason = `Server returned HTTP status ${response.statusCode}`;
          if (request.getAttemptCount() <= retryPolicy.maxAttempts) {
            const delayMs = this.retryPolicyService.calculateDelay(retryPolicy, request.getAttemptCount());
            request.recordRetry(delayMs, reason);
            await this.eventPublisher.publishAll(request.getUncommittedEvents());
            request.clearEvents();
            await this.retryPolicyService.wait(delayMs);
            continue;
          }
        }

        // Non-retriable failure (e.g. 4xx)
        request.recordFailure(`HTTP ${response.statusCode}`, response);
        await this.circuitBreakerService.recordFailure(dto.connectorId, tenantId, `HTTP ${response.statusCode}`);
        await this.historyRepo.saveRequest(request);
        return this.toResponseDto(request);

      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || 'Transport connection error';

        if (request.getAttemptCount() <= retryPolicy.maxAttempts) {
          const delayMs = this.retryPolicyService.calculateDelay(retryPolicy, request.getAttemptCount());
          request.recordRetry(delayMs, errMsg);
          await this.eventPublisher.publishAll(request.getUncommittedEvents());
          request.clearEvents();
          await this.retryPolicyService.wait(delayMs);
        } else {
          break;
        }
      }
    }

    // Final failure handling
    const errorDetails = lastError?.message || 'Outbound request execution failed after maximum retries';
    request.recordFailure(errorDetails);
    await this.circuitBreakerService.recordFailure(dto.connectorId, tenantId, errorDetails);
    await this.historyRepo.saveRequest(request);

    return this.toResponseDto(request);
  }

  public async getHistory(filters?: HttpQueryDto): Promise<RequestHistory> {
    const requests = await this.historyRepo.findHistory(filters);
    const entries = requests.map(r => ({
      requestId: r.getId().getValue(),
      tenantId: r.getTenantId(),
      connectorId: r.getConnectorId(),
      protocol: r.getProtocol(),
      endpointUrl: r.getEndpoint().getValue(),
      method: r.getMethod().getValue(),
      correlationId: r.getCorrelationId().getValue(),
      idempotencyKey: r.getIdempotencyKey()?.getValue(),
      status: r.getStatus(),
      statusCode: r.getResponse()?.statusCode,
      latencyMs: r.getResponse()?.latencyMs || 0,
      attemptCount: r.getAttemptCount(),
      errorDetails: r.getErrorDetails(),
      timestamp: r.getUpdatedAt(),
    }));

    return {
      totalCount: entries.length,
      requests: entries,
    };
  }

  public async getLatencyStatistics(connectorId?: string): Promise<ApiLatencyStatistics> {
    const requests = await this.historyRepo.findHistory({ connectorId, limit: 1000 });
    const latencies = requests
      .map(r => r.getResponse()?.latencyMs)
      .filter((l): l is number => l !== undefined)
      .sort((a, b) => a - b);

    if (latencies.length === 0) {
      return {
        connectorId,
        p50Ms: 0,
        p95Ms: 0,
        p99Ms: 0,
        averageLatencyMs: 0,
        minLatencyMs: 0,
        maxLatencyMs: 0,
        sampleSize: 0,
      };
    }

    const p50Ms = latencies[Math.floor(latencies.length * 0.5)] || 0;
    const p95Ms = latencies[Math.floor(latencies.length * 0.95)] || 0;
    const p99Ms = latencies[Math.floor(latencies.length * 0.99)] || 0;
    const sum = latencies.reduce((acc, v) => acc + v, 0);

    return {
      connectorId,
      p50Ms,
      p95Ms,
      p99Ms,
      averageLatencyMs: Math.round(sum / latencies.length),
      minLatencyMs: latencies[0],
      maxLatencyMs: latencies[latencies.length - 1],
      sampleSize: latencies.length,
    };
  }

  public async getFailureStatistics(): Promise<FailureStatistics> {
    const requests = await this.historyRepo.findHistory({ limit: 1000 });
    let totalFailures = 0;
    let serverErrorCount = 0;
    let clientErrorCount = 0;
    let timeoutCount = 0;
    const byConnector: Record<string, number> = {};

    for (const r of requests) {
      if (r.getStatus() === RequestStatus.FAILED || r.getStatus() === RequestStatus.TIMED_OUT) {
        totalFailures++;
        const connId = r.getConnectorId();
        byConnector[connId] = (byConnector[connId] || 0) + 1;

        if (r.getStatus() === RequestStatus.TIMED_OUT) timeoutCount++;
        const status = r.getResponse()?.statusCode;
        if (status) {
          if (status >= 500) serverErrorCount++;
          else if (status >= 400) clientErrorCount++;
        }
      }
    }

    return {
      totalFailures,
      serverErrorCount,
      clientErrorCount,
      timeoutCount,
      circuitOpenBlockCount: 0,
      rateLimitExceededCount: 0,
      byConnector,
    };
  }

  public async getRateLimitDashboard(tenantId: string = 'tenant-default'): Promise<RateLimitDashboard> {
    const connectors = ['STRIPE_PAYMENT', 'UBEREATS_DELIVERY', 'TOAST_POS'];
    const items = connectors.map(c => this.rateLimiterService.getStatus(c, tenantId));
    return { connectors: items };
  }

  private toResponseDto(request: OutboundRequestAggregate): OutboundResponseDto {
    const resp = request.getResponse();
    return {
      requestId: request.getId().getValue(),
      correlationId: request.getCorrelationId().getValue(),
      connectorId: request.getConnectorId(),
      status: request.getStatus(),
      statusCode: resp?.statusCode,
      latencyMs: resp?.latencyMs || 0,
      attemptCount: request.getAttemptCount(),
      headers: resp?.headers || {},
      data: resp?.data,
      errorDetails: request.getErrorDetails(),
      executedAt: request.getUpdatedAt(),
    };
  }
}
