import { IVersionNegotiator } from '../interfaces';
import { ContractVersion, ContractCompatibility, ContractName } from '../types';
import { VersionNegotiationError } from '../errors';

export class VersionNegotiator implements IVersionNegotiator {
  public parse(version: string): ContractVersion {
    const valid = /^\d+\.\d+\.\d+$/.test(version);
    if (!valid) throw new VersionNegotiationError(`Invalid semver: ${version}`);
    return version;
  }

  public detectCompatibility(source: ContractVersion, target: ContractVersion): ContractCompatibility {
    if (source === target) return ContractCompatibility.Compatible;
    
    const [sMajor, sMinor] = source.split('.').map(Number);
    const [tMajor, tMinor] = target.split('.').map(Number);

    if (sMajor !== tMajor) return ContractCompatibility.Breaking;
    if (sMinor > tMinor) return ContractCompatibility.BackwardCompatible;
    if (sMinor < tMinor) return ContractCompatibility.ForwardCompatible;
    
    return ContractCompatibility.Compatible;
  }

  public resolveLatestCompatible(_name: ContractName, target: ContractVersion): ContractVersion {
    // Basic implementation for abstract resolution
    return target;
  }
}
