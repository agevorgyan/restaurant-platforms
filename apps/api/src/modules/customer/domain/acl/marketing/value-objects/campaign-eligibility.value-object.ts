import { ValueObject } from '@saas/core';
import { CampaignReference } from './campaign-reference.value-object';

export interface CampaignEligibilityProps {
  campaignRef: CampaignReference;
  isEligible: boolean;
  reasons: string[];
}

export class CampaignEligibility extends ValueObject<CampaignEligibilityProps> {
  get campaignRef(): CampaignReference { return this.props.campaignRef; }
  get isEligible(): boolean { return this.props.isEligible; }
  get reasons(): string[] { return this.props.reasons; }

  private constructor(props: CampaignEligibilityProps) { super(props); }
  public static create(props: CampaignEligibilityProps): CampaignEligibility {
    return new CampaignEligibility(props);
  }
}