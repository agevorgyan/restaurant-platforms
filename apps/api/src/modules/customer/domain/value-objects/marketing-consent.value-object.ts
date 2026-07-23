import { ValueObject } from '@saas/core';

export interface MarketingConsentProps { isGranted: boolean; }

export class MarketingConsent extends ValueObject<MarketingConsentProps> {
  get isGranted(): boolean { return this.props.isGranted; }
  private constructor(props: MarketingConsentProps) { super(props); }
  public static create(isGranted: boolean): MarketingConsent {
    return new MarketingConsent({ isGranted });
  }
}