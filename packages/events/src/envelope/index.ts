import { CorrelationId, CausationId, TraceId, EventVersion } from '../types';
import { DomainEvent } from '../domain';

export interface EventEnvelope<TPayload> {
  readonly event: DomainEvent<TPayload>;
  readonly version: EventVersion;
  readonly correlationId: CorrelationId;
  readonly causationId: CausationId;
  readonly traceId: TraceId;
  readonly producer: string;
  readonly schemaVersion: EventVersion;
  readonly headers: Record<string, string | number | boolean>;
}
