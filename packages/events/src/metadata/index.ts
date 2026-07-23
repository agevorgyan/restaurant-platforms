import { EventId, EventType, EventVersion, AggregateVersion, CorrelationId, CausationId, TraceId } from '../types';

export interface EventMetadata {
  readonly eventId: EventId;
  readonly eventType: EventType;
  readonly eventVersion: EventVersion;
  readonly aggregateId: string;
  readonly aggregateVersion: AggregateVersion;
  readonly occurredAt: Date;
  readonly correlationId: CorrelationId;
  readonly causationId: CausationId;
  readonly traceId: TraceId;
  readonly producer: string;
}
