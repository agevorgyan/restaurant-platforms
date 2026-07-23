import { CustomerMarketingGateway } from '../services/customer-marketing-gateway.service';
import { CustomerMarketingResolver } from '../services/customer-marketing-resolver.service';
import { MarketingProfileResolver } from '../services/marketing-profile-resolver.service';
import { CustomerSegmentationService } from '../services/customer-segmentation.service';
import { CampaignEligibilityService } from '../services/campaign-eligibility.service';
import { ConsentEvaluationService } from '../services/consent-evaluation.service';
import { MarketingPreferenceMapper } from '../services/marketing-preference-mapper.service';
import { MarketingEvaluationContext } from '../value-objects/marketing-evaluation-context.value-object';
import { MarketingCorrelationId } from '../value-objects/marketing-correlation-id.value-object';
import { CustomerReference } from '../../../value-objects/customer-reference.value-object';
import { ConsentReference } from '../value-objects/consent-reference.value-object';

describe('CustomerMarketingGateway ACL', () => {
  let gateway: CustomerMarketingGateway;
  let mockEventPublisher: any;

  beforeEach(() => {
    mockEventPublisher = { publish: jest.fn() };
    gateway = new CustomerMarketingGateway(
      new CustomerMarketingResolver(),
      new MarketingProfileResolver(),
      new CustomerSegmentationService(),
      new CampaignEligibilityService(),
      new ConsentEvaluationService(),
      new MarketingPreferenceMapper(),
      mockEventPublisher
    );
  });

  it('should process a valid marketing integration request', () => {
    const context = MarketingEvaluationContext.create({
      customerRef: CustomerReference.create('c1'),
      currentConsent: ConsentReference.create('consent-1'),
      businessDateTime: new Date()
    });

    const correlationId = MarketingCorrelationId.create();

    const response = gateway.process(context, correlationId);

    expect(response.consentStatus).toBe('GRANTED');
    expect(mockEventPublisher.publish).toHaveBeenCalledTimes(2); // SegmentEvaluated & Completed
  });
});