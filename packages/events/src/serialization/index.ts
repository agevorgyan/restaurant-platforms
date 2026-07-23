import { IEventSerializer } from '../interfaces';
import { EventEnvelope } from '../envelope';
import { SerializationError } from '../errors';

export class EventSerializer implements IEventSerializer {
  public serialize<T>(envelope: EventEnvelope<T>): string | Buffer {
    try {
      return JSON.stringify(envelope);
    } catch (e: unknown) {
      throw new SerializationError(`Serialization failed: ${(e as Error).message}`);
    }
  }

  public deserialize<T>(data: string | Buffer): EventEnvelope<T> {
    try {
      const parsed = JSON.parse(data.toString());
      return parsed as EventEnvelope<T>;
    } catch (e: unknown) {
      throw new SerializationError(`Deserialization failed: ${(e as Error).message}`);
    }
  }
}

export abstract class VersionAwareSerializer extends EventSerializer {
  // Inherits base JSON and extends for backwards-compatibility migrations
}
