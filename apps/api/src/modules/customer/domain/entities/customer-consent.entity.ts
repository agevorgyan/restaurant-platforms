import { Entity } from '@saas/core';
import { MarketingConsent } from '../value-objects/marketing-consent.value-object';
import { PrivacyConsent } from '../value-objects/privacy-consent.value-object';

export interface CustomerConsentProps {
  marketingConsent: MarketingConsent;
  privacyConsent: PrivacyConsent;
}

export class CustomerConsent extends Entity<CustomerConsentProps> {
  get marketingConsent(): MarketingConsent { return this.props.marketingConsent; }
  get privacyConsent(): PrivacyConsent { return this.props.privacyConsent; }
  private constructor(id: string, props: CustomerConsentProps) { super(id, props); }
  public static create(id: string, props: CustomerConsentProps): CustomerConsent {
    return new CustomerConsent(id, props);
  }
}