/**
 * Enterprise HTTP & API Integration Platform - Domain Events
 */

import { randomUUID } from 'crypto';
import { CircuitState, RequestStatus } from '../enums/http.enums';
import { BaseDomainEvent } from './connector.events';

export class RequestQueuedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'RequestQueued';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly connectorId: string,
    public readonly endpointUrl: string,
    public readonly correlationId: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class RequestSentEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'RequestSent';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly connectorId: string,
    public readonly method: string,
    public readonly endpointUrl: string,
    public readonly correlationId: string,
    public readonly attempt: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ResponseReceivedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ResponseReceived';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly connectorId: string,
    public readonly statusCode: number,
    public readonly latencyMs: number,
    public readonly correlationId: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class RequestRetriedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'RequestRetried';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly connectorId: string,
    public readonly attemptNumber: number,
    public readonly delayMs: number,
    public readonly reason: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class CircuitOpenedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'CircuitOpened';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly connectorId: string,
    public readonly failureRatePct: number,
    public readonly resetTimeoutMs: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class CircuitClosedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'CircuitClosed';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly connectorId: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class RateLimitExceededEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'RateLimitExceeded';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly connectorId: string,
    public readonly limit: number,
    public readonly windowMs: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class RequestTimedOutEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'RequestTimedOut';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly connectorId: string,
    public readonly timeoutMs: number,
    public readonly correlationId: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export type HttpDomainEvent =
  | RequestQueuedEvent
  | RequestSentEvent
  | ResponseReceivedEvent
  | RequestRetriedEvent
  | CircuitOpenedEvent
  | CircuitClosedEvent
  | RateLimitExceededEvent
  | RequestTimedOutEvent;
