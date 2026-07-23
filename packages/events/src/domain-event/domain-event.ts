import { EventId, AggregateVersion } from '../value-objects/value-objects';

export interface DomainEvent<TPayload = unknown> {
  readonly eventId: EventId;
  readonly aggregateId: string;
  readonly aggregateType: string;
  readonly aggregateVersion: AggregateVersion;
  readonly eventType: string;
  readonly payload: TPayload;
  readonly occurredOn: Date;
}
