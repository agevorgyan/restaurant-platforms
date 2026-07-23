import { ValueObject } from '@saas/core';

export interface ReservationTranslationResultProps { isSuccess: boolean; translatedData?: any; }
export class ReservationTranslationResult extends ValueObject<ReservationTranslationResultProps> {
  get isSuccess(): boolean { return this.props.isSuccess; }
  get translatedData(): any { return this.props.translatedData; }
  private constructor(props: ReservationTranslationResultProps) { super(props); }
  public static create(isSuccess: boolean, translatedData?: any): ReservationTranslationResult { return new ReservationTranslationResult({ isSuccess, translatedData }); }
}