import { IContractTranslator } from '../interfaces';
import { ContractEnvelope } from '../envelope';
import { ContractVersion } from '../types';
import { TranslationFailureError } from '../errors';

export abstract class ContractTranslator<TSource, TTarget> implements IContractTranslator<TSource, TTarget> {
  abstract translateInbound(source: ContractEnvelope<TSource>): ContractEnvelope<TTarget>;
  abstract translateOutbound(source: ContractEnvelope<TSource>): ContractEnvelope<TTarget>;

  public mapVersion(sourceVersion: ContractVersion, targetVersion: ContractVersion): ContractVersion {
    if (!sourceVersion || !targetVersion) {
      throw new TranslationFailureError('Missing version mappings');
    }
    return targetVersion;
  }
}
