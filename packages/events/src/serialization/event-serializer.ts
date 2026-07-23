import { EventEnvelope } from '../envelope/event-envelope';

export interface EventSerializer {
  serialize(envelope: EventEnvelope): string | Buffer;
  deserialize(data: string | Buffer): EventEnvelope;
}
