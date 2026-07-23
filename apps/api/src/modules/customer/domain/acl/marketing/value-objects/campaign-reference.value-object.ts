import { ValueObject } from '@saas/core';

export interface CampaignReferenceProps { campaignId: string; }

export class CampaignReference extends ValueObject<CampaignReferenceProps> {
  get campaignId(): string { return this.props.campaignId; }
  private constructor(props: CampaignReferenceProps) { super(props); }
  public static create(campaignId: string): CampaignReference {
    return new CampaignReference({ campaignId });
  }
}