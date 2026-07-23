import { EventCompatibility, EventVersion } from '../types';
import { InvalidEventVersionError } from '../errors';

export class EventVersionStrategy {
  public parse(version: string): EventVersion {
    const valid = /^\d+\.\d+\.\d+$/.test(version);
    if (!valid) throw new InvalidEventVersionError(`Invalid semver: ${version}`);
    return version;
  }

  public detectCompatibility(source: EventVersion, target: EventVersion): EventCompatibility {
    if (source === target) return EventCompatibility.Compatible;
    
    const [sMajor, sMinor] = source.split('.').map(Number);
    const [tMajor, tMinor] = target.split('.').map(Number);

    if (sMajor !== tMajor) return EventCompatibility.Breaking;
    if (sMinor > tMinor) return EventCompatibility.BackwardCompatible;
    if (sMinor < tMinor) return EventCompatibility.ForwardCompatible;
    
    return EventCompatibility.Compatible;
  }

  public getMigrationStrategy(source: EventVersion, target: EventVersion): string {
    const comp = this.detectCompatibility(source, target);
    if (comp === EventCompatibility.Compatible) return 'NONE';
    if (comp === EventCompatibility.BackwardCompatible) return 'UPCAST';
    if (comp === EventCompatibility.ForwardCompatible) return 'DOWNCAST';
    return 'UNSUPPORTED';
  }
}
