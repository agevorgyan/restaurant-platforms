import { PricingCalculationPipeline } from './pricing-calculation-pipeline.service';
import { PricingExecutionPolicy } from '../policies/pricing-execution.policy';
import { PricingDeterminismPolicy } from '../policies/pricing-determinism.policy';
import { PricingRuleEvaluator } from './pricing-rule-evaluator.service';
import { TaxEvaluator } from './tax-evaluator.service';
import { ChargeEvaluator } from './charge-evaluator.service';
import { PricingSnapshotFactory } from './pricing-snapshot-factory.service';
import { PricingSnapshotPolicy } from '../policies/pricing-snapshot.policy';
import { PricingSession } from '../aggregates/pricing-session.aggregate';
import { PricingSessionId } from '../value-objects/pricing-session-id.value-object';
import { PricingContext } from '../value-objects/pricing-context.value-object';
import { PricingLineItem } from '../entities/pricing-line-item.entity';
import { Money } from '../../../finance/domain/value-objects/money.value-object';
import { CurrencyCode } from '../../../finance/domain/value-objects/currency-code.enum';
import { Currency } from '../../../finance/domain/value-objects/currency.value-object';

describe('PricingCalculationPipeline', () => {
  let pipeline: PricingCalculationPipeline;
  let executionPolicy: PricingExecutionPolicy;
  let determinismPolicy: PricingDeterminismPolicy;
  let ruleEvaluator: PricingRuleEvaluator;
  let taxEvaluator: TaxEvaluator;
  let chargeEvaluator: ChargeEvaluator;
  let snapshotFactory: PricingSnapshotFactory;
  let snapshotPolicy: PricingSnapshotPolicy;

  beforeEach(() => {
    executionPolicy = new PricingExecutionPolicy();
    determinismPolicy = new PricingDeterminismPolicy();
    ruleEvaluator = new PricingRuleEvaluator();
    taxEvaluator = new TaxEvaluator();
    chargeEvaluator = new ChargeEvaluator();
    snapshotPolicy = new PricingSnapshotPolicy();
    snapshotFactory = new PricingSnapshotFactory(snapshotPolicy);

    pipeline = new PricingCalculationPipeline(
      executionPolicy,
      determinismPolicy,
      ruleEvaluator,
      taxEvaluator,
      chargeEvaluator,
      snapshotFactory
    );
  });

  it('should successfully calculate a session and generate an immutable trace and snapshot', () => {
    const usd = Currency.create(CurrencyCode.USD, 2);
    const sessionId = PricingSessionId.create('session-1');
    const context = PricingContext.create({
      restaurantId: 'rest-1',
      currencyCode: CurrencyCode.USD,
      orderChannel: 'WEB',
      deliveryMethod: 'DELIVERY',
      calculationDate: new Date()
    });
    const session = PricingSession.create(sessionId, context);
    
    session.addLineItem(PricingLineItem.create('item-1', {
      productId: 'prod-1',
      quantity: 1,
      basePrice: Money.create(1000, usd),
      totalBasePrice: Money.create(1000, usd)
    }));

    const calculatedSession = pipeline.calculate(session);

    expect(calculatedSession.result).toBeDefined();
    expect(calculatedSession.trace).toBeDefined();
    expect(calculatedSession.trace?.steps.length).toBe(8); // 8 Deterministic Stages
    expect(calculatedSession.snapshot).toBeDefined();
    
    // Grand total should be 1000 since there are no rules, taxes, or charges mapped yet
    expect(calculatedSession.result?.grandTotal.amount.value).toBe(1000);
  });
});
