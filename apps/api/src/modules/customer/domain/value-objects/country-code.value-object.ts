import { ValueObject } from '@saas/core';

export interface CountryCodeProps { code: string; }

export class CountryCode extends ValueObject<CountryCodeProps> {
  get code(): string { return this.props.code; }
  private constructor(props: CountryCodeProps) { super(props); }
  public static create(code: string): CountryCode {
    if (!code || code.length !== 2) throw new Error('Valid ISO CountryCode required');
    return new CountryCode({ code });
  }
}