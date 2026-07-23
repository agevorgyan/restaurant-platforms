import { IEventRegistry } from '../interfaces';
import { EventName, EventVersion } from '../types';
import { DuplicateEventError, UnknownEventError, InvalidEventVersionError } from '../errors';

export class EventRegistry implements IEventRegistry {
  private readonly registry = new Map<EventName, Map<EventVersion, unknown>>();

  public register(name: EventName, version: EventVersion, schema: unknown): void {
    if (!this.registry.has(name)) {
      this.registry.set(name, new Map<EventVersion, unknown>());
    }

    const versions = this.registry.get(name)!;
    if (versions.has(version)) {
      throw new DuplicateEventError(`Event ${name} version ${version} is already registered.`);
    }

    versions.set(version, schema);
  }

  public lookup(name: EventName, version: EventVersion): unknown {
    const versions = this.registry.get(name);
    if (!versions) {
      throw new UnknownEventError(`Event ${name} not found.`);
    }

    const schema = versions.get(version);
    if (!schema) {
      throw new InvalidEventVersionError(`Version ${version} for event ${name} not found.`);
    }

    return schema;
  }

  public getVersions(name: EventName): EventVersion[] {
    const versions = this.registry.get(name);
    if (!versions) return [];
    return Array.from(versions.keys());
  }
}
