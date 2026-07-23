import { IEventSubscriber } from '../interfaces';
import { EventEnvelope } from '../envelope';
import { EventName } from '../types';

export abstract class EventSubscriber implements IEventSubscriber {
  public subscribe<T>(eventName: EventName, handler: (envelope: EventEnvelope<T>) => Promise<void>): void {
    this.doSubscribe(eventName, handler);
  }

  public unsubscribe(eventName: EventName): void {
    this.doUnsubscribe(eventName);
  }

  protected abstract doSubscribe<T>(eventName: EventName, handler: (envelope: EventEnvelope<T>) => Promise<void>): void;
  protected abstract doUnsubscribe(eventName: EventName): void;
}
