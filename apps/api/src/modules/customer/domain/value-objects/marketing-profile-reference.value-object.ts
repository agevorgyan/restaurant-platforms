import { ValueObject } from '@saas/core';

export interface MarketingProfileReferenceProps { profileId: string; }

export class MarketingProfileReference extends ValueObject<MarketingProfileReferenceProps> {
  get profileId(): string { return this.props.profileId; }
  private constructor(props: MarketingProfileReferenceProps) { super(props); }
  public static create(profileId: string): MarketingProfileReference {
    return new MarketingProfileReference({ profileId });
  }
}