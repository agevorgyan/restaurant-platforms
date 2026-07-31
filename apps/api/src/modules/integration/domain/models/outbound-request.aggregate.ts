/**
 * Enterprise HTTP & API Integration Platform - Outbound Request Aggregate Root
 */

import { RequestStatus, ProtocolType } from '../enums/http.enums';
import {
  RequestId,
  CorrelationId,
  IdempotencyKey,
  EndpointUrl,
  HttpMethod,
  RequestHeaders,
  RequestBody,
  ResponseBody,
  TimeoutPolicy,
  RetryPolicy,
} from '../value-objects/http-vo';
import { BaseDomainEvent } from '../events/connector.events';
import {
  RequestQueuedEvent,
  RequestSentEvent,
  ResponseReceivedEvent,
  RequestRetriedEvent,
  RequestTimedOutEvent,
} from '../events/http.events';

export interface OutboundRequestProps {
  id: RequestId;
  tenantId: string;
  connectorId: string;
  protocol: ProtocolType;
  endpoint: EndpointUrl;
  method: HttpMethod;
  headers: RequestHeaders;
  body: RequestBody;
  correlationId: CorrelationId;
  idempotencyKey?: IdempotencyKey;
  timeoutPolicy: TimeoutPolicy;
  retryPolicy: RetryPolicy;
  status: RequestStatus;
  attemptCount: number;
  response?: ResponseBody;
  errorDetails?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class OutboundRequestAggregate {
  private domainEvents: BaseDomainEvent[] = [];

  private constructor(private props: OutboundRequestProps) {}

  public static create(params: {
    id?: RequestId;
    tenantId: string;
    connectorId: string;
    protocol?: ProtocolType;
    endpointUrl: string;
    method: string;
    headers?: Record<string, string>;
    body?: unknown;
    correlationId?: string;
    idempotencyKey?: string;
    timeoutMs?: number;
    maxRetryAttempts?: number;
  }): OutboundRequestAggregate {
    const id = params.id || RequestId.generate();
    const correlationId = CorrelationId.create(params.correlationId);
    const idempotencyKey = IdempotencyKey.create(params.idempotencyKey);
    const endpoint = EndpointUrl.create(params.endpointUrl);
    const method = HttpMethod.create(params.method);
    const protocol = params.protocol || ProtocolType.REST;

    // Inject Correlation-Id header automatically
    const headersMap = {
      ...(params.headers || {}),
      'x-correlation-id': correlationId.getValue(),
    };
    if (idempotencyKey && method.isMutating()) {
      headersMap['idempotency-key'] = idempotencyKey.getValue();
    }

    const headers = RequestHeaders.create(headersMap);
    const body = RequestBody.create(params.body);
    const timeoutPolicy = TimeoutPolicy.create(params.timeoutMs || 5000);
    const retryPolicy = RetryPolicy.create({ maxAttempts: params.maxRetryAttempts });

    const now = new Date();
    const aggregate = new OutboundRequestAggregate({
      id,
      tenantId: params.tenantId,
      connectorId: params.connectorId,
      protocol,
      endpoint,
      method,
      headers,
      body,
      correlationId,
      idempotencyKey,
      timeoutPolicy,
      retryPolicy,
      status: RequestStatus.QUEUED,
      attemptCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    aggregate.addDomainEvent(
      new RequestQueuedEvent(
        id.getValue(),
        params.tenantId,
        params.connectorId,
        endpoint.getValue(),
        correlationId.getValue(),
        now
      )
    );

    return aggregate;
  }

  // --- Getters ---
  public getId(): RequestId { return this.props.id; }
  public getTenantId(): string { return this.props.tenantId; }
  public getConnectorId(): string { return this.props.connectorId; }
  public getProtocol(): ProtocolType { return this.props.protocol; }
  public getEndpoint(): EndpointUrl { return this.props.endpoint; }
  public getMethod(): HttpMethod { return this.props.method; }
  public getHeaders(): RequestHeaders { return this.props.headers; }
  public getBody(): RequestBody { return this.props.body; }
  public getCorrelationId(): CorrelationId { return this.props.correlationId; }
  public getIdempotencyKey(): IdempotencyKey | undefined { return this.props.idempotencyKey; }
  public getTimeoutPolicy(): TimeoutPolicy { return this.props.timeoutPolicy; }
  public getRetryPolicy(): RetryPolicy { return this.props.retryPolicy; }
  public getStatus(): RequestStatus { return this.props.status; }
  public getAttemptCount(): number { return this.props.attemptCount; }
  public getResponse(): ResponseBody | undefined { return this.props.response; }
  public getErrorDetails(): string | undefined { return this.props.errorDetails; }
  public getCreatedAt(): Date { return this.props.createdAt; }
  public getUpdatedAt(): Date { return this.props.updatedAt; }

  public getUncommittedEvents(): BaseDomainEvent[] { return [...this.domainEvents]; }
  public clearEvents(): void { this.domainEvents = []; }

  private addDomainEvent(event: BaseDomainEvent): void { this.domainEvents.push(event); }

  public markSending(): void {
    this.props.attemptCount++;
    this.props.status = RequestStatus.SENDING;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new RequestSentEvent(
        this.getId().getValue(),
        this.getTenantId(),
        this.getConnectorId(),
        this.getMethod().getValue(),
        this.getEndpoint().getValue(),
        this.getCorrelationId().getValue(),
        this.props.attemptCount,
        this.props.updatedAt
      )
    );
  }

  public recordSuccess(response: ResponseBody): void {
    this.props.status = RequestStatus.SUCCEEDED;
    this.props.response = response;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new ResponseReceivedEvent(
        this.getId().getValue(),
        this.getTenantId(),
        this.getConnectorId(),
        response.statusCode,
        response.latencyMs,
        this.getCorrelationId().getValue(),
        this.props.updatedAt
      )
    );
  }

  public recordRetry(delayMs: number, reason: string): void {
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new RequestRetriedEvent(
        this.getId().getValue(),
        this.getTenantId(),
        this.getConnectorId(),
        this.props.attemptCount,
        delayMs,
        reason,
        this.props.updatedAt
      )
    );
  }

  public recordFailure(errorDetails: string, response?: ResponseBody): void {
    this.props.status = RequestStatus.FAILED;
    this.props.errorDetails = errorDetails;
    if (response) this.props.response = response;
    this.props.updatedAt = new Date();
  }

  public recordTimeout(timeoutMs: number): void {
    this.props.status = RequestStatus.TIMED_OUT;
    this.props.errorDetails = `Request timed out after ${timeoutMs}ms`;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new RequestTimedOutEvent(
        this.getId().getValue(),
        this.getTenantId(),
        this.getConnectorId(),
        timeoutMs,
        this.getCorrelationId().getValue(),
        this.props.updatedAt
      )
    );
  }
}
