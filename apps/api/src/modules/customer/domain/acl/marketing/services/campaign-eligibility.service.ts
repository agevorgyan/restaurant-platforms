import { MarketingEvaluationContext } from '../value-objects/marketing-evaluation-context.value-object';
import { CampaignEligibility } from '../value-objects/campaign-eligibility.value-object';
import { CampaignReference } from '../value-objects/campaign-reference.value-object';

export class CampaignEligibilityService {
  public evaluate(context: MarketingEvaluationContext): CampaignEligibility {
    return CampaignEligibility.create({
      campaignRef: context.campaignRef || CampaignReference.create('none'),
      isEligible: !!context.campaignRef,
      reasons: []
    });
  }
}