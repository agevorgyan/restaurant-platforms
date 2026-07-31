/**
 * Enterprise Webhook Platform - Domain Value Objects
 *
 * Implements immutable domain value objects.
 * STRICT RULE: Never expose raw webhook payloads directly to the Domain layer.
 */

import { randomUUID } from 'crypto';
import { SignatureType } from '../enums/webhook.enums';
import { WebhookRejectedException, ReplayAttackException } from '../exceptions/webhook.exceptions';

export class WebhookId {
  private constructor(private readonly value: string) {}

  public static create(value: string): WebhookId {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new WebhookRejectedException('WebhookId cannot be empty');
    }
    return new WebhookId(value.trim());
  }

  public static generate(): WebhookId {
    return new WebhookId(randomUUID());
  }

  public getValue(): string {
    return this.value;
  }
}

export class WebhookDeliveryId {
  private constructor(private readonly value: string) {}

  public static create(value?: string): WebhookDeliveryId {
    const val = value?.trim() || `del_${randomUUID()}`;
    return new WebhookDeliveryId(val);
  }

  public getValue(): string {
    return this.value;
  }
}

export class WebhookEndpoint {
  private constructor(private readonly value: string) {}

  public static create(path: string): WebhookEndpoint {
    const trimmed = path?.trim();
    if (!trimmed || !trimmed.startsWith('/')) {
      throw new WebhookRejectedException(`WebhookEndpoint must start with '/'. Received: '${path}'`);
    }
    return new WebhookEndpoint(trimmed);
  }

  public getValue(): string {
    return this.value;
  }
}

export class WebhookSecretReference {
  private constructor(
    public readonly secretArn: string,
    public readonly secretKeyRef: string,
    public readonly provider: string = 'HASHICORP_VAULT'
  ) {}

  public static create(secretArn: string, secretKeyRef: string = 'webhook_secret'): WebhookSecretReference {
    if (!secretArn || secretArn.trim().length === 0) {
      throw new WebhookRejectedException('secretArn is mandatory for WebhookSecretReference');
    }
    return new WebhookSecretReference(secretArn.trim(), secretKeyRef.trim());
  }
}

export class WebhookSignature {
  private constructor(
    public readonly signature: string,
    public readonly type: SignatureType
  ) {}

  public static create(signatureStr: string, type: SignatureType = SignatureType.HMAC_SHA256): WebhookSignature {
    const trimmed = signatureStr?.trim();
    if (!trimmed) {
      throw new WebhookRejectedException('WebhookSignature cannot be empty');
    }
    return new WebhookSignature(trimmed, type);
  }
}

export class WebhookPayload {
  private constructor(private readonly rawPayload: string) {}

  public static create(raw: string | Buffer | object): WebhookPayload {
    let strPayload: string;
    if (typeof raw === 'string') {
      strPayload = raw;
    } else if (Buffer.isBuffer(raw)) {
      strPayload = raw.toString('utf8');
    } else if (typeof raw === 'object' && raw !== null) {
      strPayload = JSON.stringify(raw);
    } else {
      throw new WebhookRejectedException('Invalid WebhookPayload format');
    }

    return new WebhookPayload(strPayload);
  }

  public getRawPayload(): string {
    return this.rawPayload;
  }

  public parseJson<T = Record<string, unknown>>(): T {
    try {
      return JSON.parse(this.rawPayload) as T;
    } catch {
      throw new WebhookRejectedException('Failed to parse webhook JSON payload body');
    }
  }
}

export class WebhookHeaders {
  private constructor(private readonly headers: Record<string, string>) {}

  public static create(headers: Record<string, string | string[] | undefined>): WebhookHeaders {
    const normalized: Record<string, string> = {};
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (v !== undefined && v !== null) {
          normalized[k.toLowerCase()] = Array.isArray(v) ? v.join(',') : String(v);
        }
      }
    }
    return new WebhookHeaders(normalized);
  }

  public getHeaders(): Record<string, string> {
    return { ...this.headers };
  }

  public get(name: string): string | undefined {
    return this.headers[name.toLowerCase()];
  }
}

export class WebhookTimestamp {
  private constructor(private readonly date: Date) {}

  public static create(timestampHeader?: string | number): WebhookTimestamp {
    if (!timestampHeader) return new WebhookTimestamp(new Date());

    let date: Date;
    if (typeof timestampHeader === 'number') {
      // Check if unix timestamp is in seconds or ms
      date = timestampHeader < 10000000000 ? new Date(timestampHeader * 1000) : new Date(timestampHeader);
    } else {
      const parsedNum = Number(timestampHeader);
      if (!isNaN(parsedNum)) {
        date = parsedNum < 10000000000 ? new Date(parsedNum * 1000) : new Date(parsedNum);
      } else {
        date = new Date(timestampHeader);
      }
    }

    if (isNaN(date.getTime())) {
      throw new WebhookRejectedException(`Invalid WebhookTimestamp format: '${timestampHeader}'`);
    }

    return new WebhookTimestamp(date);
  }

  public getDate(): Date {
    return this.date;
  }

  public getEpochMs(): number {
    return this.date.getTime();
  }
}

export class WebhookNonce {
  private constructor(private readonly value: string) {}

  public static create(nonceStr?: string): WebhookNonce {
    const trimmed = nonceStr?.trim();
    if (!trimmed) {
      return new WebhookNonce(`nonce_${randomUUID()}`);
    }
    return new WebhookNonce(trimmed);
  }

  public getValue(): string {
    return this.value;
  }
}

export class ReplayWindow {
  private constructor(public readonly maxSkewMs: number) {}

  public static default(): ReplayWindow {
    return new ReplayWindow(300000); // 5 minutes default
  }

  public static create(maxSkewMs: number): ReplayWindow {
    const clamped = Math.max(5000, Math.min(86400000, maxSkewMs));
    return new ReplayWindow(clamped);
  }

  public validateTimestamp(timestamp: WebhookTimestamp): void {
    const now = Date.now();
    const diff = Math.abs(now - timestamp.getEpochMs());
    if (diff > this.maxSkewMs) {
      throw new ReplayAttackException(
        `Webhook timestamp '${timestamp.getDate().toISOString()}' is outside acceptable replay window (${Math.round(this.maxSkewMs / 1000)}s)`
      );
    }
  }
}

export class WebhookRetryPolicy {
  constructor(
    public readonly maxAttempts: number = 5,
    public readonly initialBackoffMs: number = 1000,
    public readonly maxBackoffMs: number = 60000
  ) {}

  public static default(): WebhookRetryPolicy {
    return new WebhookRetryPolicy();
  }
}
