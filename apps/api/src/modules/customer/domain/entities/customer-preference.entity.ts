import { Entity } from '@saas/core';
import { PreferredLanguage } from '../value-objects/preferred-language.value-object';
import { PreferredCurrency } from '../value-objects/preferred-currency.value-object';
import { PreferredTimezone } from '../value-objects/preferred-timezone.value-object';

export interface CustomerPreferenceProps {
  language?: PreferredLanguage;
  currency?: PreferredCurrency;
  timezone?: PreferredTimezone;
}

export class CustomerPreference extends Entity<CustomerPreferenceProps> {
  private constructor(id: string, props: CustomerPreferenceProps) { super(id, props); }
  public static create(id: string, props: CustomerPreferenceProps): CustomerPreference {
    return new CustomerPreference(id, props);
  }
}