import { ValueObject } from '@saas/core';

export interface CurrencyReferenceProps { code: string; }

export class CurrencyReference extends ValueObject<CurrencyReferenceProps> {
  get code(): string { return this.props.code; }
  private constructor(props: CurrencyReferenceProps) { super(props); }
  public static create(code: string): CurrencyReference {
    if (!code) throw new Error('Currency code is required');
    return new CurrencyReference({ code: code.toUpperCase() });
  }
}