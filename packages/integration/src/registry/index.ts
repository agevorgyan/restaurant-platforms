import { IContractRegistry } from '../interfaces';
import { ContractName, ContractVersion } from '../types';
import { DuplicateContractError, UnknownContractError, UnknownVersionError } from '../errors';

export class ContractRegistry implements IContractRegistry {
  private readonly registry = new Map<ContractName, Map<ContractVersion, unknown>>();

  public register(name: ContractName, version: ContractVersion, schema: unknown): void {
    if (!this.registry.has(name)) {
      this.registry.set(name, new Map<ContractVersion, unknown>());
    }

    const versions = this.registry.get(name)!;
    if (versions.has(version)) {
      throw new DuplicateContractError(`Contract ${name} version ${version} is already registered.`);
    }

    versions.set(version, schema);
  }

  public lookup(name: ContractName, version: ContractVersion): unknown {
    const versions = this.registry.get(name);
    if (!versions) {
      throw new UnknownContractError(`Contract ${name} not found.`);
    }

    const schema = versions.get(version);
    if (!schema) {
      throw new UnknownVersionError(`Version ${version} for contract ${name} not found.`);
    }

    return schema;
  }

  public getVersions(name: ContractName): ContractVersion[] {
    const versions = this.registry.get(name);
    if (!versions) return [];
    return Array.from(versions.keys());
  }
}
