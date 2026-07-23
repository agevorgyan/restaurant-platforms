import { ValueObject } from '@saas/core';

export interface TranslationResultProps {
  success: boolean;
  domainPayload?: any;
  errors?: string[];
}

export class TranslationResult extends ValueObject<TranslationResultProps> {
  get success(): boolean { return this.props.success; }
  get domainPayload(): any { return this.props.domainPayload; }
  get errors(): string[] | undefined { return this.props.errors; }
  private constructor(props: TranslationResultProps) { super(props); }
  public static create(props: TranslationResultProps): TranslationResult {
    return new TranslationResult(props);
  }
}