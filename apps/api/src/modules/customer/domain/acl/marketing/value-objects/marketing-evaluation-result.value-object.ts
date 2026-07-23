import { ValueObject } from '@saas/core';
import { CustomerSegment } from './customer-segment.value-object';
import { CampaignReference } from './campaign-reference.value-object';

export interface MarketingEvaluationResultProps {
  eligible: boolean;
  segment?: CustomerSegment;
  allowedChannels: string[];
  eligibleCampaigns: CampaignReference[];
  consentStatus: string;
  reasons: string[];
}

export class MarketingEvaluationResult extends ValueObject<MarketingEvaluationResultProps> {
  get eligible(): boolean { return this.props.eligible; }
  get segment(): CustomerSegment | undefined { return this.props.segment; }
  get allowedChannels(): string[] { return this.props.allowedChannels; }
  get eligibleCampaigns(): CampaignReference[] { return this.props.eligibleCampaigns; }
  get consentStatus(): string { return this.props.consentStatus; }
  get reasons(): string[] { return this.props.reasons; }

  private constructor(props: MarketingEvaluationResultProps) { super(props); }
  public static create(props: MarketingEvaluationResultProps): MarketingEvaluationResult {
    return new MarketingEvaluationResult(props);
  }
}