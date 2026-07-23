import { DomainEvent } from '../domain-event/domain-event';
import { EventMetadata } from '../metadata/event-metadata';

export interface EventEnvelope<TEvent extends DomainEvent = DomainEvent> {
  readonly event: TEvent;
  readonly metadata: EventMetadata;
}
