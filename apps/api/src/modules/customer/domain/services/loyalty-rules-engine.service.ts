import { LoyaltyEvaluationContext } from '../value-objects/loyalty-evaluation-context.value-object';
import { LoyaltyEvaluationResult } from '../value-objects/loyalty-evaluation-result.value-object';
import { PointsCalculationService } from './points-calculation.service';
import { TierEvaluationService } from './tier-evaluation.service';
import { RewardEligibilityService } from './reward-eligibility.service';
import { ExpirationEvaluationService } from './expiration-evaluation.service';
import { LoyaltyRuleResolver } from './loyalty-rule-resolver.service';
import { RuleExecutionId } from '../value-objects/rule-execution-id.value-object';
import { LoyaltyEvaluationStartedEvent, LoyaltyEvaluationCompletedEvent } from '../events/engine.events';


export interface EventPublisher {
  publish(event: any): void;
}

export class LoyaltyRulesEngine {
  constructor(
    private readonly pointsService: PointsCalculationService,
    private readonly tierService: TierEvaluationService,
    private readonly rewardService: RewardEligibilityService,
    private readonly expirationService: ExpirationEvaluationService,
    private readonly ruleResolver: LoyaltyRuleResolver,
    private readonly eventPublisher: EventPublisher
  ) {}

  public evaluate(context: LoyaltyEvaluationContext): LoyaltyEvaluationResult {
    const executionId = RuleExecutionId.create();
    
    this.eventPublisher.publish(
      new LoyaltyEvaluationStartedEvent(executionId.value, context.loyaltyAccountRef.loyaltyId)
    );

    // Order defined by business rules
    // 1. Resolve Rules (Account Status & Transaction Type derived in context setup)
    this.ruleResolver.resolveExecutionOrder(context);

    // 2. Promotion & Tier Rules
    const tierDecision = this.tierService.evaluate(context);

    // 3. Points Calculation
    const pointsCalc = this.pointsService.calculate(context);

    // 4. Reward Eligibility
    const rewardDecision = this.rewardService.evaluate(context);

    // 5. Expiration Rules
    const expirationDecision = this.expirationService.evaluate(context);

    const result = LoyaltyEvaluationResult.create({
      approved: true,
      rejected: false,
      pointsToEarn: pointsCalc.amount,
      pointsToRedeem: pointsCalc.amount, // Simplified mapping
      newTier: tierDecision.isUpgraded ? tierDecision.tier : undefined,
      eligibleRewards: rewardDecision.eligibleRewards,
      expirationImpact: expirationDecision.amountToExpire,
      reasons: [
        ...pointsCalc.reasons,
        ...tierDecision.reasons,
        ...rewardDecision.reasons,
        ...expirationDecision.reasons
      ]
    });

    this.eventPublisher.publish(
      new LoyaltyEvaluationCompletedEvent(executionId.value, context.loyaltyAccountRef.loyaltyId)
    );

    return result;
  }
}