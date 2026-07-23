import { ValueObject } from '@saas/core';

export interface PrivacyConsentProps { isGranted: boolean; }

export class PrivacyConsent extends ValueObject<PrivacyConsentProps> {
  get isGranted(): boolean { return this.props.isGranted; }
  private constructor(props: PrivacyConsentProps) { super(props); }
  public static create(isGranted: boolean): PrivacyConsent {
    return new PrivacyConsent({ isGranted });
  }
}