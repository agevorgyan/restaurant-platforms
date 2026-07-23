import { ValueObject } from '@saas/core';

export interface ReservationTranslationFailureProps { reason: string; errorCode: string; }
export class ReservationTranslationFailure extends ValueObject<ReservationTranslationFailureProps> {
  get reason(): string { return this.props.reason; }
  get errorCode(): string { return this.props.errorCode; }
  private constructor(props: ReservationTranslationFailureProps) { super(props); }
  public static create(reason: string, errorCode: string): ReservationTranslationFailure { return new ReservationTranslationFailure({ reason, errorCode }); }
}