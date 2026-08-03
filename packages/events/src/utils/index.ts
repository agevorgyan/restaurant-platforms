import { IEventStore } from '../interfaces';
import { EventEnvelope } from '../envelope';
import { ReplayError } from '../errors';
import { EventMetadata } from '../metadata';

/**
 * Creates a valid EventMetadata with auto-generated defaults.
 * Intended for use in domain event constructors when metadata is not yet
 * enriched by the infrastructure dispatcher layer.
 *
 * @param overrides - Optional partial overrides for specific metadata fields.
 */
export function createEventMetadata(overrides?: Partial<EventMetadata>): EventMetadata {
  const now = new Date();
  const id = crypto.randomUUID();
  return {
    eventId: overrides?.eventId ?? id,
    eventType: overrides?.eventType ?? '',
    eventVersion: overrides?.eventVersion ?? '1',
    aggregateId: overrides?.aggregateId ?? '',
    aggregateVersion: overrides?.aggregateVersion ?? 0,
    occurredAt: overrides?.occurredAt ?? now,
    correlationId: overrides?.correlationId ?? id,
    causationId: overrides?.causationId ?? id,
    traceId: overrides?.traceId ?? id,
    producer: overrides?.producer ?? 'domain',
  };
}

export class EventReplayService {
  constructor(private readonly eventStore: IEventStore) {}

  public async replayByAggregate<T>(aggregateId: string): Promise<EventEnvelope<T>[]> {
    try {
      return await this.eventStore.replay<T>({ aggregateId });
    } catch (e: unknown) {
      throw new ReplayError(`Failed to replay by aggregate: ${(e as Error).message}`);
    }
  }

  public async replayByTime<T>(fromTime: Date): Promise<EventEnvelope<T>[]> {
    try {
      return await this.eventStore.replay<T>({ fromTime });
    } catch (e: unknown) {
      throw new ReplayError(`Failed to replay by time: ${(e as Error).message}`);
    }
  }

  public async replayByType<T>(eventType: string): Promise<EventEnvelope<T>[]> {
    try {
      return await this.eventStore.replay<T>({ eventType });
    } catch (e: unknown) {
      throw new ReplayError(`Failed to replay by type: ${(e as Error).message}`);
    }
  }
}

export const generateEventId = (): string => crypto.randomUUID();
