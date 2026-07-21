import { MarketingEventId } from '../value-objects/marketing-event-id.value-object';
import { EventVersion } from '../value-objects/event-version.value-object';
import { EventCorrelationId } from '../value-objects/event-correlation-id.value-object';
import { EventCausationId } from '../value-objects/event-causation-id.value-object';
import { EventSource } from '../value-objects/event-source.value-object';
import { EventPriority } from '../value-objects/event-priority.value-object';

export class MarketingEventMetadata {
  constructor(
    public readonly eventId: MarketingEventId,
    public readonly version: EventVersion,
    public readonly source: EventSource,
    public readonly priority: EventPriority,
    public readonly timestamp: Date,
    public readonly correlationId?: EventCorrelationId,
    public readonly causationId?: EventCausationId,
  ) {}

  public static create(
    eventId: string,
    version: number,
    source: EventSource,
    priority: EventPriority,
    correlationId?: string,
    causationId?: string
  ): MarketingEventMetadata {
    return new MarketingEventMetadata(
      MarketingEventId.create(eventId),
      EventVersion.create(version),
      source,
      priority,
      new Date(),
      correlationId ? EventCorrelationId.create(correlationId) : undefined,
      causationId ? EventCausationId.create(causationId) : undefined
    );
  }
}
