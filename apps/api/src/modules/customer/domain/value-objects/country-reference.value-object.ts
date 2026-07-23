import { ValueObject } from '@saas/core';

export interface CountryReferenceProps { countryId: string; }

export class CountryReference extends ValueObject<CountryReferenceProps> {
  get countryId(): string { return this.props.countryId; }
  private constructor(props: CountryReferenceProps) { super(props); }
  public static create(countryId: string): CountryReference {
    return new CountryReference({ countryId });
  }
}