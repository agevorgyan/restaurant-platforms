/**
 * Enterprise HTTP & API Integration Platform - Domain Exceptions
 */

export class HttpIntegrationException extends Error {
  constructor(message: string, public readonly code: string = 'HTTP_INTEGRATION_ERROR') {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class CircuitBreakerOpenException extends HttpIntegrationException {
  constructor(connectorId: string, resetTimeoutMs: number) {
    super(
      `Circuit breaker for connector '${connectorId}' is OPEN. Requests blocked for ${resetTimeoutMs}ms.`,
      'CIRCUIT_BREAKER_OPEN'
    );
  }
}

export class RateLimitExceededException extends HttpIntegrationException {
  constructor(connectorId: string, limit: number, windowMs: number) {
    super(
      `Rate limit exceeded for connector '${connectorId}'. Maximum ${limit} requests per ${windowMs}ms allowed.`,
      'RATE_LIMIT_EXCEEDED'
    );
  }
}

export class RequestTimeoutException extends HttpIntegrationException {
  constructor(requestId: string, timeoutMs: number) {
    super(`Request '${requestId}' timed out after ${timeoutMs}ms`, 'REQUEST_TIMEOUT');
  }
}

export class DuplicateIdempotentRequestException extends HttpIntegrationException {
  constructor(idempotencyKey: string) {
    super(`Duplicate request detected for Idempotency-Key '${idempotencyKey}'`, 'DUPLICATE_IDEMPOTENT_REQUEST');
  }
}

export class InvalidHttpRequestException extends HttpIntegrationException {
  constructor(message: string) {
    super(message, 'INVALID_HTTP_REQUEST');
  }
}
