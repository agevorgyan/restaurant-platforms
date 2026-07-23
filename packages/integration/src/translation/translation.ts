import { ContractEnvelope } from '../envelope/contract-envelope';

export interface VersionNegotiator {
  isSupported(version: string): boolean;
  getLatestSupportedVersion(): string;
  negotiate(requestedVersion: string): string;
}

export interface ContractTranslator<TInternal, TExternal> {
  translateToExternal(internalEvent: TInternal): ContractEnvelope<TExternal>;
  translateToInternal(externalContract: ContractEnvelope<TExternal>): TInternal;
}

export interface ContractRegistry {
  registerTranslator<TInternal, TExternal>(
    eventType: string,
    version: string,
    translator: ContractTranslator<TInternal, TExternal>
  ): void;

  getTranslator<TInternal, TExternal>(
    eventType: string,
    version: string
  ): ContractTranslator<TInternal, TExternal> | undefined;
}

export interface ReferenceResolver<TReference, TTarget> {
  resolve(reference: TReference): Promise<TTarget | null>;
  createReference(target: TTarget): TReference;
}
