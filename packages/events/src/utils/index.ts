import { IEventStore } from '../interfaces';
import { EventEnvelope } from '../envelope';
import { ReplayError } from '../errors';

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
