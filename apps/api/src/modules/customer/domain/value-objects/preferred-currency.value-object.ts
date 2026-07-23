import { ValueObject } from '@saas/core';

export interface PreferredCurrencyProps { code: string; }

export class PreferredCurrency extends ValueObject<PreferredCurrencyProps> {
  get code(): string { return this.props.code; }
  private constructor(props: PreferredCurrencyProps) { super(props); }
  public static create(code: string): PreferredCurrency {
    return new PreferredCurrency({ code });
  }
}