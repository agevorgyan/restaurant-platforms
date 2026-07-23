import { IEventPublisher } from '../interfaces';
import { EventEnvelope } from '../envelope';
import { DispatchError } from '../errors';

export abstract class EventPublisher implements IEventPublisher {
  public async publish<T>(envelope: EventEnvelope<T>): Promise<void> {
    try {
      await this.doPublish(envelope);
    } catch (e: unknown) {
      throw new DispatchError(`Failed to publish event: ${(e as Error).message}`);
    }
  }

  public async publishMany<T>(envelopes: EventEnvelope<T>[]): Promise<void> {
    try {
      await Promise.all(envelopes.map(env => this.doPublish(env)));
    } catch (e: unknown) {
      throw new DispatchError(`Failed to publish multiple events: ${(e as Error).message}`);
    }
  }

  protected abstract doPublish<T>(envelope: EventEnvelope<T>): Promise<void>;
}
