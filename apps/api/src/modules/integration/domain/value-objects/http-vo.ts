/**
 * Enterprise HTTP & API Integration Platform - Domain Value Objects
 */

import { randomUUID } from 'crypto';
import { HttpMethodEnum, CircuitState } from '../enums/http.enums';
import { InvalidHttpRequestException } from '../exceptions/http.exceptions';

export class RequestId {
  private constructor(private readonly value: string) {}

  public static create(value: string): RequestId {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new InvalidHttpRequestException('RequestId cannot be empty');
    }
    return new RequestId(value.trim());
  }

  public static generate(): RequestId {
    return new RequestId(randomUUID());
  }

  public getValue(): string {
    return this.value;
  }
}

export class CorrelationId {
  private constructor(private readonly value: string) {}

  public static create(value?: string): CorrelationId {
    const val = value?.trim() || `corr_${randomUUID()}`;
    return new CorrelationId(val);
  }

  public getValue(): string {
    return this.value;
  }
}

export class IdempotencyKey {
  private constructor(private readonly value: string) {}

  public static create(key?: string): IdempotencyKey | undefined {
    if (!key || key.trim().length === 0) return undefined;
    const trimmed = key.trim();
    if (trimmed.length < 8 || trimmed.length > 128) {
      throw new InvalidHttpRequestException('IdempotencyKey length must be between 8 and 128 characters');
    }
    return new IdempotencyKey(trimmed);
  }

  public getValue(): string {
    return this.value;
  }
}

export class EndpointUrl {
  private constructor(private readonly value: string) {}

  public static create(urlStr: string): EndpointUrl {
    const trimmed = urlStr?.trim();
    if (!trimmed) {
      throw new InvalidHttpRequestException('EndpointUrl cannot be empty');
    }

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      throw new InvalidHttpRequestException(`EndpointUrl must use HTTP or HTTPS protocol. Received: '${urlStr}'`);
    }

    try {
      new URL(trimmed);
    } catch {
      throw new InvalidHttpRequestException(`Malformed EndpointUrl: '${urlStr}'`);
    }

    return new EndpointUrl(trimmed);
  }

  public getValue(): string {
    return this.value;
  }

  public isHttps(): boolean {
    return this.value.startsWith('https://');
  }
}

export class HttpMethod {
  private constructor(private readonly value: HttpMethodEnum) {}

  public static create(methodStr: HttpMethodEnum | string): HttpMethod {
    const uppercase = (methodStr as string)?.toUpperCase();
    if (!Object.values(HttpMethodEnum).includes(uppercase as HttpMethodEnum)) {
      throw new InvalidHttpRequestException(`Unsupported HttpMethod: '${methodStr}'`);
    }
    return new HttpMethod(uppercase as HttpMethodEnum);
  }

  public getValue(): HttpMethodEnum {
    return this.value;
  }

  public isMutating(): boolean {
    return this.value === HttpMethodEnum.POST || this.value === HttpMethodEnum.PUT || this.value === HttpMethodEnum.PATCH || this.value === HttpMethodEnum.DELETE;
  }
}

export class RequestHeaders {
  private static readonly SENSITIVE_HEADERS = ['authorization', 'x-api-key', 'proxy-authorization', 'cookie', 'set-cookie'];

  private constructor(private readonly headers: Record<string, string>) {}

  public static create(headers?: Record<string, string | number | boolean>): RequestHeaders {
    const normalized: Record<string, string> = {};
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (v !== undefined && v !== null) {
          normalized[k.toLowerCase()] = String(v);
        }
      }
    }
    return new RequestHeaders(normalized);
  }

  public getHeaders(): Record<string, string> {
    return { ...this.headers };
  }

  public getMaskedHeaders(): Record<string, string> {
    const masked: Record<string, string> = {};
    for (const [k, v] of Object.entries(this.headers)) {
      if (RequestHeaders.SENSITIVE_HEADERS.includes(k)) {
        masked[k] = '[REDACTED_SECRET]';
      } else {
        masked[k] = v;
      }
    }
    return masked;
  }

  public get(name: string): string | undefined {
    return this.headers[name.toLowerCase()];
  }
}

export class RequestBody {
  private constructor(private readonly payload: unknown) {}

  public static create(payload?: unknown): RequestBody {
    return new RequestBody(payload);
  }

  public getPayload(): unknown {
    return this.payload;
  }

  public toString(): string {
    if (this.payload === undefined || this.payload === null) return '';
    if (typeof this.payload === 'string') return this.payload;
    return JSON.stringify(this.payload);
  }
}

export class ResponseBody {
  constructor(
    public readonly statusCode: number,
    public readonly data: unknown,
    public readonly headers: Record<string, string>,
    public readonly latencyMs: number
  ) {}

  public isSuccess(): boolean {
    return this.statusCode >= 200 && this.statusCode < 300;
  }

  public isServerError(): boolean {
    return this.statusCode >= 500;
  }
}

export class TimeoutPolicy {
  private constructor(
    public readonly connectionTimeoutMs: number,
    public readonly socketTimeoutMs: number
  ) {}

  public static create(connectionMs: number = 5000, socketMs: number = 10000): TimeoutPolicy {
    const conn = Math.max(500, Math.min(30000, connectionMs));
    const sock = Math.max(500, Math.min(120000, socketMs));
    return new TimeoutPolicy(conn, sock);
  }
}

export class RetryPolicy {
  private constructor(
    public readonly maxAttempts: number,
    public readonly initialDelayMs: number,
    public readonly maxDelayMs: number,
    public readonly backoffMultiplier: number,
    public readonly jitterRatio: number
  ) {}

  public static create(props?: {
    maxAttempts?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
    backoffMultiplier?: number;
    jitterRatio?: number;
  }): RetryPolicy {
    const maxAttempts = props?.maxAttempts !== undefined ? Math.max(0, Math.min(10, props.maxAttempts)) : 3;
    const initialDelayMs = props?.initialDelayMs || 200;
    const maxDelayMs = props?.maxDelayMs || 5000;
    const backoffMultiplier = props?.backoffMultiplier || 2.0;
    const jitterRatio = props?.jitterRatio !== undefined ? props.jitterRatio : 0.25;

    return new RetryPolicy(maxAttempts, initialDelayMs, maxDelayMs, backoffMultiplier, jitterRatio);
  }

  public calculateBackoffDelay(attempt: number): number {
    if (attempt <= 0) return 0;
    const rawDelay = Math.min(this.maxDelayMs, this.initialDelayMs * Math.pow(this.backoffMultiplier, attempt - 1));
    const jitter = rawDelay * this.jitterRatio * (Math.random() * 2 - 1); // ±jitterRatio
    return Math.max(0, Math.round(rawDelay + jitter));
  }
}

export class CircuitBreakerStateVO {
  constructor(
    public readonly state: CircuitState,
    public readonly failureThresholdPct: number = 50,
    public readonly minRequests: number = 10,
    public readonly resetTimeoutMs: number = 30000,
    public readonly halfOpenMaxRequests: number = 5
  ) {}

  public static initial(): CircuitBreakerStateVO {
    return new CircuitBreakerStateVO(CircuitState.CLOSED);
  }
}

export class RateLimitPolicy {
  constructor(
    public readonly requestsPerWindow: number = 100,
    public readonly windowSizeMs: number = 60000,
    public readonly burstLimit: number = 120
  ) {}

  public static default(): RateLimitPolicy {
    return new RateLimitPolicy();
  }
}
