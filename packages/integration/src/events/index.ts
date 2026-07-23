import { ContractName, ContractVersion } from '../types';

export interface ContractRegistered {
  readonly name: ContractName;
  readonly version: ContractVersion;
  readonly registeredAt: Date;
}

export interface ContractTranslated {
  readonly sourceName: ContractName;
  readonly sourceVersion: ContractVersion;
  readonly targetVersion: ContractVersion;
  readonly translatedAt: Date;
}

export interface VersionNegotiated {
  readonly name: ContractName;
  readonly requestedVersion: ContractVersion;
  readonly resolvedVersion: ContractVersion;
}

export interface ReferenceResolved {
  readonly referenceId: string;
  readonly context: string;
}

export interface IntegrationFailed {
  readonly correlationId: string;
  readonly reason: string;
  readonly occurredAt: Date;
}

export interface TranslationFailed {
  readonly sourceName: ContractName;
  readonly reason: string;
}
