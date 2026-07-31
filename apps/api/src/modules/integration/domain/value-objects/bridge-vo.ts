/**
 * Enterprise Integration Event Bridge - Domain Value Objects
 */

import { randomUUID } from 'crypto';
import { EventSourceType, EventTargetType, EventPriorityEnum, TranslationResultEnum } from '../enums/bridge.enums';
import { BridgeDomainException } from '../exceptions/bridge.exceptions';

export class BridgeEventId {
  private constructor(private readonly value: string) {}

  public static create(value: string): BridgeEventId {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new BridgeDomainException('BridgeEventId cannot be empty');
    }
    return new BridgeEventId(value.trim());
  }

  public static generate(): BridgeEventId {
    return new BridgeEventId(randomUUID());
  }

  public getValue(): string {
    return this.value;
  }
}

export class ExternalEventId {
  private constructor(private readonly value: string) {}

  public static create(value?: string): ExternalEventId {
    const val = value?.trim() || `ext_${randomUUID()}`;
    return new ExternalEventId(val);
  }

  public getValue(): string {
    return this.value;
  }
}

export class InternalEventId {
  private constructor(private readonly value: string) {}

  public static create(value?: string): InternalEventId {
    const val = value?.trim() || `int_${randomUUID()}`;
    return new InternalEventId(val);
  }

  public getValue(): string {
    return this.value;
  }
}

export class EventCorrelationId {
  private constructor(private readonly value: string) {}

  public static create(value?: string): EventCorrelationId {
    const val = value?.trim() || `corr_${randomUUID()}`;
    return new EventCorrelationId(val);
  }

  public getValue(): string {
    return this.value;
  }
}

export class EventPriority {
  private constructor(public readonly value: EventPriorityEnum) {}

  public static default(): EventPriority {
    return new EventPriority(EventPriorityEnum.NORMAL);
  }

  public static create(priority: EventPriorityEnum = EventPriorityEnum.NORMAL): EventPriority {
    return new EventPriority(priority);
  }
}

export class EventMetadata {
  constructor(
    public readonly tenantId: string,
    public readonly sourceType: EventSourceType,
    public readonly targetType: EventTargetType,
    public readonly correlationId: EventCorrelationId,
    public readonly timestamp: Date = new Date(),
    public readonly isReplay: boolean = false,
    public readonly schemaVersion: string = '1.0.0'
  ) {}

  public static create(params: {
    tenantId: string;
    sourceType: EventSourceType;
    targetType: EventTargetType;
    correlationId?: EventCorrelationId;
    isReplay?: boolean;
    schemaVersion?: string;
  }): EventMetadata {
    return new EventMetadata(
      params.tenantId,
      params.sourceType,
      params.targetType,
      params.correlationId || EventCorrelationId.create(),
      new Date(),
      params.isReplay || false,
      params.schemaVersion || '1.0.0'
    );
  }
}

export class EventEnvelope<T = Record<string, unknown>> {
  constructor(
    public readonly internalEventId: InternalEventId,
    public readonly eventName: string,
    public readonly metadata: EventMetadata,
    public readonly payload: T
  ) {}

  public static create<T = Record<string, unknown>>(params: {
    eventName: string;
    metadata: EventMetadata;
    payload: T;
  }): EventEnvelope<T> {
    return new EventEnvelope(InternalEventId.create(), params.eventName, params.metadata, params.payload);
  }
}

export class BridgeContext {
  constructor(
    public readonly tenantId: string,
    public readonly connectorId: string,
    public readonly traceId: string
  ) {}

  public static create(tenantId: string, connectorId: string): BridgeContext {
    return new BridgeContext(tenantId, connectorId, randomUUID());
  }
}

export class BridgeRoute {
  constructor(
    public readonly sourceEventType: string,
    public readonly targetEventType: string,
    public readonly targetType: EventTargetType,
    public readonly priority: EventPriority = EventPriority.default()
  ) {}

  public static create(
    sourceEventType: string,
    targetEventType: string,
    targetType: EventTargetType = EventTargetType.INTEGRATION_EVENT,
    priorityEnum: EventPriorityEnum = EventPriorityEnum.NORMAL
  ): BridgeRoute {
    return new BridgeRoute(sourceEventType, targetEventType, targetType, EventPriority.create(priorityEnum));
  }
}

export class BridgePolicy {
  constructor(
    public readonly maxAttempts: number = 3,
    public readonly enableDeduplication: boolean = true,
    public readonly dlqOnFailure: boolean = true
  ) {}

  public static default(): BridgePolicy {
    return new BridgePolicy();
  }
}

export class EventTranslation {
  constructor(
    public readonly resultStatus: TranslationResultEnum,
    public readonly sourcePayload: Record<string, unknown>,
    public readonly translatedPayload: Record<string, unknown>,
    public readonly errorReason?: string
  ) {}

  public static success(source: Record<string, unknown>, translated: Record<string, unknown>): EventTranslation {
    return new EventTranslation(TranslationResultEnum.SUCCESS, source, translated);
  }

  public static failed(source: Record<string, unknown>, reason: string): EventTranslation {
    return new EventTranslation(TranslationResultEnum.FAILED, source, {}, reason);
  }
}
