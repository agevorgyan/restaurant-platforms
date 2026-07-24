import { Identifier, DomainPrimitive } from '@saas/domain';

export class WebhookId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): WebhookId { return new WebhookId(value); }
  public static generate(): WebhookId { return new WebhookId(crypto.randomUUID()); }
}

export class WebhookEndpoint extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): WebhookEndpoint {
    if (!value || !value.startsWith('https://')) {
      throw new Error('WebhookEndpoint must be a valid HTTPS URL');
    }
    return new WebhookEndpoint(value);
  }
}

export class WebhookEvent extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): WebhookEvent {
    if (!value || value.trim() === '') throw new Error('WebhookEvent cannot be empty');
    return new WebhookEvent(value);
  }
}

export class WebhookSecret extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): WebhookSecret {
    if (!value || value.length < 32) throw new Error('WebhookSecret must be at least 32 characters long');
    return new WebhookSecret(value);
  }
}

export class WebhookSignature extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): WebhookSignature {
    if (!value || !value.startsWith('sha256=')) {
      throw new Error('WebhookSignature must start with sha256=');
    }
    return new WebhookSignature(value);
  }
}

export enum WebhookStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  FAILED = 'FAILED'
}

export class WebhookStatus extends DomainPrimitive<WebhookStatusEnum> {
  private constructor(value: WebhookStatusEnum) { super(value); }
  public static create(value: WebhookStatusEnum): WebhookStatus {
    if (!Object.values(WebhookStatusEnum).includes(value)) throw new Error(`Invalid WebhookStatus: ${value}`);
    return new WebhookStatus(value);
  }
}

export class DeliveryAttempt extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): DeliveryAttempt {
    if (value < 1) throw new Error('DeliveryAttempt must be >= 1');
    return new DeliveryAttempt(value);
  }
}

export interface WebhookRetryPolicyProps {
  maxAttempts: number;
  backoffRate: number;
}

export class WebhookRetryPolicy extends DomainPrimitive<WebhookRetryPolicyProps> {
  private constructor(value: WebhookRetryPolicyProps) { super(value); }
  public static create(value: WebhookRetryPolicyProps): WebhookRetryPolicy {
    if (value.maxAttempts < 0) throw new Error('maxAttempts cannot be negative');
    return new WebhookRetryPolicy(value);
  }
}

export class TimeoutPolicy extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): TimeoutPolicy {
    if (value < 100) throw new Error('TimeoutPolicy must be >= 100ms');
    return new TimeoutPolicy(value);
  }
}
