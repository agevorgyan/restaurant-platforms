import { DomainEvent } from '../domain';
import { EventEnvelope } from '../envelope';
import { EventName, EventVersion } from '../types';

export type IDomainEvent<T> = DomainEvent<T>;

export interface IEventSerializer {
  serialize<T>(envelope: EventEnvelope<T>): string | Buffer;
  deserialize<T>(data: string | Buffer): EventEnvelope<T>;
}

export interface IEventPublisher {
  publish<T>(envelope: EventEnvelope<T>): Promise<void>;
  publishMany<T>(envelopes: EventEnvelope<T>[]): Promise<void>;
}

export interface IEventSubscriber {
  subscribe<T>(eventName: EventName, handler: (envelope: EventEnvelope<T>) => Promise<void>): void;
  unsubscribe(eventName: EventName): void;
}

export interface IEventDispatcher {
  dispatch<T>(envelope: EventEnvelope<T>): Promise<void>;
  dispatchMany<T>(envelopes: EventEnvelope<T>[]): Promise<void>;
}

export interface IEventRegistry {
  register(name: EventName, version: EventVersion, schema: unknown): void;
  lookup(name: EventName, version: EventVersion): unknown;
  getVersions(name: EventName): EventVersion[];
}

export interface IEventStore {
  append<T>(aggregateId: string, events: EventEnvelope<T>[]): Promise<void>;
  load<T>(aggregateId: string): Promise<EventEnvelope<T>[]>;
  replay<T>(criteria: { aggregateId?: string; fromTime?: Date; eventType?: string }): Promise<EventEnvelope<T>[]>;
}
