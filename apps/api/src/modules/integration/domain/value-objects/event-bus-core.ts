import { Identifier, DomainPrimitive } from '@saas/domain';

export class EventId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): EventId { return new EventId(value); }
  public static generate(): EventId { return new EventId(crypto.randomUUID()); }
}

export enum EventTypeEnum {
  DOMAIN_EVENT = 'DOMAIN_EVENT',
  INTEGRATION_EVENT = 'INTEGRATION_EVENT',
  SYSTEM_EVENT = 'SYSTEM_EVENT',
  NOTIFICATION_EVENT = 'NOTIFICATION_EVENT'
}

export class EventType extends DomainPrimitive<EventTypeEnum> {
  private constructor(value: EventTypeEnum) { super(value); }
  public static create(value: EventTypeEnum): EventType {
    if (!Object.values(EventTypeEnum).includes(value)) throw new Error(`Invalid EventType: ${value}`);
    return new EventType(value);
  }
}

export class EventName extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): EventName {
    if (!value || value.trim() === '') throw new Error('EventName cannot be empty');
    return new EventName(value);
  }
}

export class EventVersion extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): EventVersion {
    if (!/^[0-9]+\.[0-9]+$/.test(value)) throw new Error('EventVersion must be in format x.y');
    return new EventVersion(value);
  }
}

export class EventSource extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): EventSource {
    if (!value || value.trim() === '') throw new Error('EventSource cannot be empty');
    return new EventSource(value);
  }
}

export class EventDestination extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): EventDestination {
    if (!value || value.trim() === '') throw new Error('EventDestination cannot be empty');
    return new EventDestination(value);
  }
}

export class CorrelationId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): CorrelationId { return new CorrelationId(value); }
  public static generate(): CorrelationId { return new CorrelationId(crypto.randomUUID()); }
}

export class CausationId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): CausationId { return new CausationId(value); }
  public static generate(): CausationId { return new CausationId(crypto.randomUUID()); }
}

export class MessageKey extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): MessageKey {
    if (!value || value.trim() === '') throw new Error('MessageKey cannot be empty');
    return new MessageKey(value);
  }
}

export enum DeliveryPolicyEnum {
  AT_LEAST_ONCE = 'AT_LEAST_ONCE',
  AT_MOST_ONCE = 'AT_MOST_ONCE',
  EXACTLY_ONCE = 'EXACTLY_ONCE'
}

export class DeliveryPolicy extends DomainPrimitive<DeliveryPolicyEnum> {
  private constructor(value: DeliveryPolicyEnum) { super(value); }
  public static create(value: DeliveryPolicyEnum): DeliveryPolicy {
    if (!Object.values(DeliveryPolicyEnum).includes(value)) throw new Error(`Invalid DeliveryPolicy: ${value}`);
    return new DeliveryPolicy(value);
  }
}

export interface RetryPolicyProps {
  maxRetries: number;
  backoffMultiplier: number;
  initialDelayMs: number;
}

export class RetryPolicy extends DomainPrimitive<RetryPolicyProps> {
  private constructor(value: RetryPolicyProps) { super(value); }
  public static create(value: RetryPolicyProps): RetryPolicy {
    if (value.maxRetries < 0) throw new Error('maxRetries cannot be negative');
    if (value.backoffMultiplier < 1) throw new Error('backoffMultiplier must be >= 1');
    return new RetryPolicy(value);
  }
}
