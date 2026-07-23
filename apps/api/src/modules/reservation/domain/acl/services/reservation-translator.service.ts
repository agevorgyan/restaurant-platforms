import { ReservationTranslationResult } from '../value-objects/reservation-translation-result.value-object';
import { ReservationTranslationFailure } from '../value-objects/reservation-translation-failure.value-object';
import { ReservationContractTranslator } from './reservation-contract-translator.service';

export class ReservationTranslator {
  constructor(private readonly translator: ReservationContractTranslator) {}

  public executeTranslation(payload: any): ReservationTranslationResult | ReservationTranslationFailure {
    try {
      return this.translator.translate(payload);
    } catch (err: any) {
      return ReservationTranslationFailure.create(err.message, 'TRANSLATION_ERR');
    }
  }
}