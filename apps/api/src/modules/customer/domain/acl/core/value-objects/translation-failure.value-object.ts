import { ValueObject } from '@saas/core';

export interface TranslationFailureProps { reason: string; context: string; }

export class TranslationFailure extends ValueObject<TranslationFailureProps> {
  get reason(): string { return this.props.reason; }
  get context(): string { return this.props.context; }
  private constructor(props: TranslationFailureProps) { super(props); }
  public static create(props: TranslationFailureProps): TranslationFailure {
    return new TranslationFailure(props);
  }
}