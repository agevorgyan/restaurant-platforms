import { EventId, EventName, AggregateVersion } from '../types';
import { EventMetadata } from '../metadata';

export abstract class DomainEvent<TPayload> {
  public readonly eventId: EventId;
  public readonly eventName: EventName;
  public readonly aggregateId: string;
  public readonly aggregateType: string;
  public readonly aggregateVersion: AggregateVersion;
  public readonly occurredAt: Date;
  public readonly payload: TPayload;
  public readonly metadata: EventMetadata;

  constructor(
    eventId: EventId,
    eventName: EventName,
    aggregateId: string,
    aggregateType: string,
    aggregateVersion: AggregateVersion,
    occurredAt: Date,
    payload: TPayload,
    metadata: EventMetadata
  ) {
    this.eventId = eventId;
    this.eventName = eventName;
    this.aggregateId = aggregateId;
    this.aggregateType = aggregateType;
    this.aggregateVersion = aggregateVersion;
    this.occurredAt = occurredAt;
    this.payload = payload;
    this.metadata = metadata;
  }
}
