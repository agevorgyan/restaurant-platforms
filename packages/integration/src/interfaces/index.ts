import { ContractEnvelope } from '../envelope';
import { ContractName, ContractVersion, ContractCompatibility } from '../types';
import { IntegrationContext } from '../context';

export interface IContractTranslator<TSource, TTarget> {
  translateInbound(source: ContractEnvelope<TSource>): ContractEnvelope<TTarget>;
  translateOutbound(source: ContractEnvelope<TSource>): ContractEnvelope<TTarget>;
  mapVersion(sourceVersion: ContractVersion, targetVersion: ContractVersion): ContractVersion;
}

export interface IContractRegistry {
  register(name: ContractName, version: ContractVersion, schema: unknown): void;
  lookup(name: ContractName, version: ContractVersion): unknown;
  getVersions(name: ContractName): ContractVersion[];
}

export interface IVersionNegotiator {
  parse(version: string): ContractVersion;
  detectCompatibility(source: ContractVersion, target: ContractVersion): ContractCompatibility;
  resolveLatestCompatible(name: ContractName, target: ContractVersion): ContractVersion;
}

export interface IReferenceResolver<TReference, TEntity> {
  resolve(reference: TReference): Promise<TEntity>;
}

export interface IIntegrationSerializer {
  serialize<T>(envelope: ContractEnvelope<T>): string | Buffer;
  deserialize<T>(data: string | Buffer): ContractEnvelope<T>;
}

export interface IIntegrationContextProvider {
  getContext(): IntegrationContext;
}
