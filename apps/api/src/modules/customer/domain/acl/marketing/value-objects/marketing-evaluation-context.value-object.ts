import { ValueObject } from '@saas/core';
import { CustomerReference } from '../../../value-objects/customer-reference.value-object';
import { MarketingProfileReference } from './marketing-profile-reference.value-object';
import { CampaignReference } from './campaign-reference.value-object';
import { CustomerSegment } from './customer-segment.value-object';
import { ConsentReference } from './consent-reference.value-object';

export interface MarketingEvaluationContextProps {
  customerRef: CustomerReference;
  marketingProfileRef?: MarketingProfileReference;
  campaignRef?: CampaignReference;
  currentSegment?: CustomerSegment;
  currentConsent?: ConsentReference;
  businessDateTime: Date;
}

export class MarketingEvaluationContext extends ValueObject<MarketingEvaluationContextProps> {
  get customerRef(): CustomerReference { return this.props.customerRef; }
  get marketingProfileRef(): MarketingProfileReference | undefined { return this.props.marketingProfileRef; }
  get campaignRef(): CampaignReference | undefined { return this.props.campaignRef; }
  get currentSegment(): CustomerSegment | undefined { return this.props.currentSegment; }
  get currentConsent(): ConsentReference | undefined { return this.props.currentConsent; }
  get businessDateTime(): Date { return this.props.businessDateTime; }

  private constructor(props: MarketingEvaluationContextProps) { super(props); }
  public static create(props: MarketingEvaluationContextProps): MarketingEvaluationContext {
    return new MarketingEvaluationContext(props);
  }
}