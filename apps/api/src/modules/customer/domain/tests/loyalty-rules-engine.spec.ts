import { LoyaltyRulesEngine } from '../services/loyalty-rules-engine.service';
import { PointsCalculationService } from '../services/points-calculation.service';
import { TierEvaluationService } from '../services/tier-evaluation.service';
import { RewardEligibilityService } from '../services/reward-eligibility.service';
import { ExpirationEvaluationService } from '../services/expiration-evaluation.service';
import { LoyaltyRuleResolver } from '../services/loyalty-rule-resolver.service';
import { LoyaltyEvaluationContext } from '../value-objects/loyalty-evaluation-context.value-object';
import { CustomerReference } from '../value-objects/customer-reference.value-object';
import { LoyaltyAccountReference } from '../value-objects/loyalty-account-reference.value-object';
import { LoyaltyTierVo } from '../value-objects/loyalty-tier.value-object';
import { LoyaltyTier, TransactionType } from '../enums/loyalty.enums';
import { PointsBalance } from '../value-objects/points-balance.value-object';

describe('LoyaltyRulesEngine', () => {
  let engine: LoyaltyRulesEngine;
  let mockEventPublisher: any;

  beforeEach(() => {
    mockEventPublisher = { publish: jest.fn() };
    engine = new LoyaltyRulesEngine(
      new PointsCalculationService(),
      new TierEvaluationService(),
      new RewardEligibilityService(),
      new ExpirationEvaluationService(),
      new LoyaltyRuleResolver(),
      mockEventPublisher
    );
  });

  it('should evaluate context statelessly and return a result', () => {
    const context = LoyaltyEvaluationContext.create({
      customerRef: CustomerReference.create('c1'),
      loyaltyAccountRef: LoyaltyAccountReference.create('l1'),
      currentTier: LoyaltyTierVo.create(LoyaltyTier.BASIC),
      currentPoints: PointsBalance.create(100),
      transactionType: TransactionType.EARN,
      businessDateTime: new Date()
    });

    const result = engine.evaluate(context);
    expect(result.approved).toBe(true);
    expect(result.pointsToEarn.value).toBe(0);
    expect(mockEventPublisher.publish).toHaveBeenCalledTimes(2); // Started & Completed events
  });
});