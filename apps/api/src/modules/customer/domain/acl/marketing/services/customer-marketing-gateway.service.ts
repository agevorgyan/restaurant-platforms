import { MarketingEvaluationContext } from '../value-objects/marketing-evaluation-context.value-object';
import { MarketingEvaluationResult } from '../value-objects/marketing-evaluation-result.value-object';
import { MarketingCorrelationId } from '../value-objects/marketing-correlation-id.value-object';
import { CustomerMarketingResolver } from './customer-marketing-resolver.service';
import { MarketingProfileResolver } from './marketing-profile-resolver.service';
import { CustomerSegmentationService } from './customer-segmentation.service';
import { CampaignEligibilityService } from './campaign-eligibility.service';
import { ConsentEvaluationService } from './consent-evaluation.service';
import { MarketingPreferenceMapper } from './marketing-preference-mapper.service';
import { 
  MarketingIntegrationCompletedEvent, 
  CustomerSegmentEvaluatedEvent 
} from '../events/marketing-acl.events';

export interface EventPublisher {
  publish(event: any): void;
}

export class CustomerMarketingGateway {
  constructor(
    private readonly endpointResolver: CustomerMarketingResolver,
    private readonly profileResolver: MarketingProfileResolver,
    private readonly segmentationService: CustomerSegmentationService,
    private readonly campaignService: CampaignEligibilityService,
    private readonly consentService: ConsentEvaluationService,
    private readonly preferenceMapper: MarketingPreferenceMapper,
    private readonly eventPublisher: EventPublisher
  ) {}

  public process(context: MarketingEvaluationContext, correlationId: MarketingCorrelationId): MarketingEvaluationResult {
    // Determine profile
    const profileRef = this.profileResolver.resolveByCustomer(context.customerRef);
    void profileRef;

    // Evaluate Sub-services
    const segment = this.segmentationService.evaluate(context);
    const campaignEligibility = this.campaignService.evaluate(context);
    const consentStatus = this.consentService.evaluate(context);
    const allowedChannels = this.preferenceMapper.mapToChannels({});

    this.eventPublisher.publish(
      new CustomerSegmentEvaluatedEvent(correlationId.value, context.customerRef.customerId)
    );

    const result = MarketingEvaluationResult.create({
      eligible: campaignEligibility.isEligible && consentStatus === 'GRANTED',
      segment,
      allowedChannels,
      eligibleCampaigns: campaignEligibility.isEligible ? [campaignEligibility.campaignRef] : [],
      consentStatus,
      reasons: campaignEligibility.reasons
    });

    this.eventPublisher.publish(
      new MarketingIntegrationCompletedEvent(correlationId.value, context.customerRef.customerId)
    );

    return result;
  }
}