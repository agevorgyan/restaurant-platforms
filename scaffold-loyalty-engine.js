const fs = require('fs');
const path = require('path');

const moduleDir = '/Users/apple/Downloads/Projects/Restaurant Platform/restaurant-platforms/apps/api/src/modules/customer/domain';

const filesToCreate = {
  // Value Objects
  'value-objects/loyalty-evaluation-context.value-object.ts': `import { ValueObject } from '@saas/core';
import { CustomerReference } from './customer-reference.value-object';
import { LoyaltyAccountReference } from './loyalty-account-reference.value-object';
import { OrderReference } from './order-reference.value-object';
import { PromotionReference } from './promotion-reference.value-object';
import { LoyaltyTierVo } from './loyalty-tier.value-object';
import { PointsBalance } from './points-balance.value-object';
import { TransactionType } from '../enums/loyalty.enums';

export interface LoyaltyEvaluationContextProps {
  customerRef: CustomerReference;
  loyaltyAccountRef: LoyaltyAccountReference;
  orderRef?: OrderReference;
  promotionRef?: PromotionReference;
  currentTier: LoyaltyTierVo;
  currentPoints: PointsBalance;
  transactionType: TransactionType;
  businessDateTime: Date;
}

export class LoyaltyEvaluationContext extends ValueObject<LoyaltyEvaluationContextProps> {
  get customerRef(): CustomerReference { return this.props.customerRef; }
  get loyaltyAccountRef(): LoyaltyAccountReference { return this.props.loyaltyAccountRef; }
  get orderRef(): OrderReference | undefined { return this.props.orderRef; }
  get promotionRef(): PromotionReference | undefined { return this.props.promotionRef; }
  get currentTier(): LoyaltyTierVo { return this.props.currentTier; }
  get currentPoints(): PointsBalance { return this.props.currentPoints; }
  get transactionType(): TransactionType { return this.props.transactionType; }
  get businessDateTime(): Date { return this.props.businessDateTime; }

  private constructor(props: LoyaltyEvaluationContextProps) { super(props); }
  public static create(props: LoyaltyEvaluationContextProps): LoyaltyEvaluationContext {
    return new LoyaltyEvaluationContext(props);
  }
}`,

  'value-objects/loyalty-evaluation-result.value-object.ts': `import { ValueObject } from '@saas/core';
import { LoyaltyTierVo } from './loyalty-tier.value-object';
import { RuleReason } from './rule-reason.value-object';
import { PointsAmount } from './points-amount.value-object';
import { RewardReference } from './reward-reference.value-object';

export interface LoyaltyEvaluationResultProps {
  approved: boolean;
  rejected: boolean;
  pointsToEarn: PointsAmount;
  pointsToRedeem: PointsAmount;
  newTier?: LoyaltyTierVo;
  eligibleRewards: RewardReference[];
  expirationImpact: PointsAmount;
  reasons: RuleReason[];
}

export class LoyaltyEvaluationResult extends ValueObject<LoyaltyEvaluationResultProps> {
  get approved(): boolean { return this.props.approved; }
  get rejected(): boolean { return this.props.rejected; }
  get pointsToEarn(): PointsAmount { return this.props.pointsToEarn; }
  get pointsToRedeem(): PointsAmount { return this.props.pointsToRedeem; }
  get newTier(): LoyaltyTierVo | undefined { return this.props.newTier; }
  get eligibleRewards(): RewardReference[] { return this.props.eligibleRewards; }
  get expirationImpact(): PointsAmount { return this.props.expirationImpact; }
  get reasons(): RuleReason[] { return this.props.reasons; }

  private constructor(props: LoyaltyEvaluationResultProps) { super(props); }
  public static create(props: LoyaltyEvaluationResultProps): LoyaltyEvaluationResult {
    return new LoyaltyEvaluationResult(props);
  }
}`,

  'value-objects/points-calculation.value-object.ts': `import { ValueObject } from '@saas/core';
import { PointsAmount } from './points-amount.value-object';
import { RuleReason } from './rule-reason.value-object';

export interface PointsCalculationProps {
  amount: PointsAmount;
  reasons: RuleReason[];
}

export class PointsCalculation extends ValueObject<PointsCalculationProps> {
  get amount(): PointsAmount { return this.props.amount; }
  get reasons(): RuleReason[] { return this.props.reasons; }
  private constructor(props: PointsCalculationProps) { super(props); }
  public static create(props: PointsCalculationProps): PointsCalculation {
    return new PointsCalculation(props);
  }
}`,

  'value-objects/tier-decision.value-object.ts': `import { ValueObject } from '@saas/core';
import { LoyaltyTierVo } from './loyalty-tier.value-object';
import { RuleReason } from './rule-reason.value-object';

export interface TierDecisionProps {
  tier: LoyaltyTierVo;
  isUpgraded: boolean;
  reasons: RuleReason[];
}

export class TierDecision extends ValueObject<TierDecisionProps> {
  get tier(): LoyaltyTierVo { return this.props.tier; }
  get isUpgraded(): boolean { return this.props.isUpgraded; }
  get reasons(): RuleReason[] { return this.props.reasons; }
  private constructor(props: TierDecisionProps) { super(props); }
  public static create(props: TierDecisionProps): TierDecision {
    return new TierDecision(props);
  }
}`,

  'value-objects/reward-eligibility.value-object.ts': `import { ValueObject } from '@saas/core';
import { RewardReference } from './reward-reference.value-object';
import { RuleReason } from './rule-reason.value-object';

export interface RewardEligibilityProps {
  eligibleRewards: RewardReference[];
  reasons: RuleReason[];
}

export class RewardEligibility extends ValueObject<RewardEligibilityProps> {
  get eligibleRewards(): RewardReference[] { return this.props.eligibleRewards; }
  get reasons(): RuleReason[] { return this.props.reasons; }
  private constructor(props: RewardEligibilityProps) { super(props); }
  public static create(props: RewardEligibilityProps): RewardEligibility {
    return new RewardEligibility(props);
  }
}`,

  'value-objects/expiration-decision.value-object.ts': `import { ValueObject } from '@saas/core';
import { PointsAmount } from './points-amount.value-object';
import { RuleReason } from './rule-reason.value-object';

export interface ExpirationDecisionProps {
  amountToExpire: PointsAmount;
  reasons: RuleReason[];
}

export class ExpirationDecision extends ValueObject<ExpirationDecisionProps> {
  get amountToExpire(): PointsAmount { return this.props.amountToExpire; }
  get reasons(): RuleReason[] { return this.props.reasons; }
  private constructor(props: ExpirationDecisionProps) { super(props); }
  public static create(props: ExpirationDecisionProps): ExpirationDecision {
    return new ExpirationDecision(props);
  }
}`,

  'value-objects/rule-execution-id.value-object.ts': `import { ValueObject } from '@saas/core';

export interface RuleExecutionIdProps { value: string; }

export class RuleExecutionId extends ValueObject<RuleExecutionIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: RuleExecutionIdProps) { super(props); }
  public static create(value?: string): RuleExecutionId {
    return new RuleExecutionId({ value: value || crypto.randomUUID() });
  }
}`,

  'value-objects/rule-priority.value-object.ts': `import { ValueObject } from '@saas/core';

export interface RulePriorityProps { level: number; }

export class RulePriority extends ValueObject<RulePriorityProps> {
  get level(): number { return this.props.level; }
  private constructor(props: RulePriorityProps) { super(props); }
  public static create(level: number): RulePriority {
    return new RulePriority({ level });
  }
}`,

  'value-objects/rule-reason.value-object.ts': `import { ValueObject } from '@saas/core';

export interface RuleReasonProps { code: string; message: string; }

export class RuleReason extends ValueObject<RuleReasonProps> {
  get code(): string { return this.props.code; }
  get message(): string { return this.props.message; }
  private constructor(props: RuleReasonProps) { super(props); }
  public static create(code: string, message: string): RuleReason {
    return new RuleReason({ code, message });
  }
}`,

  // Domain Events
  'events/engine.events.ts': `import { DomainEvent } from '@saas/core';

export class LoyaltyEvaluationStartedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly executionId: string, public readonly accountId: string) {}
  getAggregateId(): string { return this.accountId; }
}

export class LoyaltyEvaluationCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly executionId: string, public readonly accountId: string) {}
  getAggregateId(): string { return this.accountId; }
}

export class TierEvaluationCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly executionId: string, public readonly accountId: string) {}
  getAggregateId(): string { return this.accountId; }
}

export class RewardEligibilityCalculatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly executionId: string, public readonly accountId: string) {}
  getAggregateId(): string { return this.accountId; }
}

export class PointsCalculationCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly executionId: string, public readonly accountId: string) {}
  getAggregateId(): string { return this.accountId; }
}

export class RuleExecutionFailedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly executionId: string, public readonly accountId: string, public readonly reason: string) {}
  getAggregateId(): string { return this.accountId; }
}`,

  // Specifications
  'specifications/engine.specifications.ts': `export class PointsCalculationSpecification {
  public static isEligible(context: any): boolean {
    void context;
    return true;
  }
}

export class TierUpgradeSpecification {
  public static canUpgrade(context: any): boolean {
    void context;
    return true;
  }
}

export class RewardEligibilitySpecification {
  public static isEligible(context: any): boolean {
    void context;
    return true;
  }
}

export class PointExpirationSpecification {
  public static hasExpiredPoints(context: any): boolean {
    void context;
    return false;
  }
}

export class RuleConsistencySpecification {
  public static isConsistent(context: any): boolean {
    return !!context.customerRef && !!context.loyaltyAccountRef;
  }
}`,

  // Policies
  'policies/engine.policies.ts': `export class PointsCalculationPolicy {
  public static enforce(context: any): void {
    void context;
  }
}

export class TierEvaluationPolicy {
  public static enforce(context: any): void {
    void context;
  }
}

export class RewardEvaluationPolicy {
  public static enforce(context: any): void {
    void context;
  }
}

export class ExpirationEvaluationPolicy {
  public static enforce(context: any): void {
    void context;
  }
}

export class RuleExecutionPolicy {
  public static enforce(context: any): void {
    if (!context) throw new Error('Evaluation context cannot be null');
  }
}`,

  // Services
  'services/points-calculation.service.ts': `import { LoyaltyEvaluationContext } from '../value-objects/loyalty-evaluation-context.value-object';
import { PointsCalculation } from '../value-objects/points-calculation.value-object';
import { PointsAmount } from '../value-objects/points-amount.value-object';

export class PointsCalculationService {
  public calculate(context: LoyaltyEvaluationContext): PointsCalculation {
    // Pure function logic
    void context;
    return PointsCalculation.create({ amount: PointsAmount.create(0), reasons: [] });
  }
}`,

  'services/tier-evaluation.service.ts': `import { LoyaltyEvaluationContext } from '../value-objects/loyalty-evaluation-context.value-object';
import { TierDecision } from '../value-objects/tier-decision.value-object';

export class TierEvaluationService {
  public evaluate(context: LoyaltyEvaluationContext): TierDecision {
    return TierDecision.create({
      tier: context.currentTier,
      isUpgraded: false,
      reasons: []
    });
  }
}`,

  'services/reward-eligibility.service.ts': `import { LoyaltyEvaluationContext } from '../value-objects/loyalty-evaluation-context.value-object';
import { RewardEligibility } from '../value-objects/reward-eligibility.value-object';

export class RewardEligibilityService {
  public evaluate(context: LoyaltyEvaluationContext): RewardEligibility {
    void context;
    return RewardEligibility.create({
      eligibleRewards: [],
      reasons: []
    });
  }
}`,

  'services/expiration-evaluation.service.ts': `import { LoyaltyEvaluationContext } from '../value-objects/loyalty-evaluation-context.value-object';
import { ExpirationDecision } from '../value-objects/expiration-decision.value-object';
import { PointsAmount } from '../value-objects/points-amount.value-object';

export class ExpirationEvaluationService {
  public evaluate(context: LoyaltyEvaluationContext): ExpirationDecision {
    void context;
    return ExpirationDecision.create({
      amountToExpire: PointsAmount.create(0),
      reasons: []
    });
  }
}`,

  'services/loyalty-rule-resolver.service.ts': `import { LoyaltyEvaluationContext } from '../value-objects/loyalty-evaluation-context.value-object';
import { RulePriority } from '../value-objects/rule-priority.value-object';

export class LoyaltyRuleResolver {
  public resolveExecutionOrder(context: LoyaltyEvaluationContext): RulePriority[] {
    void context;
    return [
      RulePriority.create(1),
      RulePriority.create(2)
    ];
  }
}`,

  'services/loyalty-rules-engine.service.ts': `import { LoyaltyEvaluationContext } from '../value-objects/loyalty-evaluation-context.value-object';
import { LoyaltyEvaluationResult } from '../value-objects/loyalty-evaluation-result.value-object';
import { PointsCalculationService } from './points-calculation.service';
import { TierEvaluationService } from './tier-evaluation.service';
import { RewardEligibilityService } from './reward-eligibility.service';
import { ExpirationEvaluationService } from './expiration-evaluation.service';
import { LoyaltyRuleResolver } from './loyalty-rule-resolver.service';
import { RuleExecutionId } from '../value-objects/rule-execution-id.value-object';
import { LoyaltyEvaluationStartedEvent, LoyaltyEvaluationCompletedEvent } from '../events/engine.events';
import { EventPublisher } from '@saas/core';

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
}`,

  // Tests
  'tests/loyalty-rules-engine.spec.ts': `import { LoyaltyRulesEngine } from '../services/loyalty-rules-engine.service';
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
});`
};

Object.keys(filesToCreate).forEach(relPath => {
  const fullPath = path.join(moduleDir, relPath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, filesToCreate[relPath]);
  console.log('Created:', fullPath);
});
