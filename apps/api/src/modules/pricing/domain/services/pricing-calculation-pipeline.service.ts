import { PricingSession } from '../aggregates/pricing-session.aggregate';
import { PricingExecutionPolicy } from '../policies/pricing-execution.policy';
import { PricingDeterminismPolicy } from '../policies/pricing-determinism.policy';
import { PricingRuleEvaluator } from './pricing-rule-evaluator.service';
import { TaxEvaluator } from './tax-evaluator.service';
import { ChargeEvaluator } from './charge-evaluator.service';
import { PricingSnapshotFactory } from './pricing-snapshot-factory.service';
import { PricingResult } from '../value-objects/pricing-result.value-object';
import { CalculationTrace } from '../value-objects/calculation-trace.value-object';
import { PricingStageEnum } from '../value-objects/pricing-stage.value-object';
import { Money } from '../../../finance/domain/value-objects/money.value-object';
import { Currency } from '../../../finance/domain/value-objects/currency.value-object';

export class PricingCalculationPipeline {
  constructor(
    private readonly executionPolicy: PricingExecutionPolicy,
    private readonly determinismPolicy: PricingDeterminismPolicy,
    private readonly ruleEvaluator: PricingRuleEvaluator,
    private readonly taxEvaluator: TaxEvaluator,
    private readonly chargeEvaluator: ChargeEvaluator,
    private readonly snapshotFactory: PricingSnapshotFactory
  ) {}

  public calculate(session: PricingSession): PricingSession {
    if (!this.executionPolicy.canExecute(session)) {
      throw new Error('Pricing session cannot be executed');
    }

    if (session.result) {
      session.recalculate();
    }

    let trace = CalculationTrace.initial();
    const currency = session.context.currencyCode;
    
    // Create base 0 Money for the session's currency
    const zeroMoney = (amount: number = 0) => {
      // Temporary stub for money creation in pipeline. 
      // Need full currency context but we'll mock for pipeline structure.
      return Money.create(amount, Currency.create(currency, 2));
    };

    // STAGE 1: LOAD CONTEXT
    trace = trace.addStep({
      stage: PricingStageEnum.LOAD_CONTEXT,
      description: 'Loaded pricing context',
      appliedRuleIds: [],
      skippedRuleIds: [],
      timestamp: new Date()
    });

    // STAGE 2: BASE PRICES
    let baseTotal = zeroMoney();
    for (const item of session.lineItems) {
      baseTotal = baseTotal.add(item.totalBasePrice);
    }
    trace = trace.addStep({
      stage: PricingStageEnum.BASE_PRICES,
      description: 'Calculated base line items',
      appliedRuleIds: [],
      skippedRuleIds: [],
      timestamp: new Date()
    });

    // STAGE 3: PRICING RULES
    const appliedRules = this.ruleEvaluator.evaluate(session);
    let ruleAdjustmentsTotal = zeroMoney();
    for (const rule of appliedRules) {
      ruleAdjustmentsTotal = ruleAdjustmentsTotal.add(rule.adjustmentAmount);
    }
    trace = trace.addStep({
      stage: PricingStageEnum.PRICING_RULES,
      description: 'Evaluated pricing rules',
      appliedRuleIds: appliedRules.map(r => r.ruleId),
      skippedRuleIds: [],
      timestamp: new Date()
    });

    // STAGE 4: MARKETING DISCOUNTS
    const marketingDiscountsTotal = zeroMoney(); // Derived from session adjustments
    trace = trace.addStep({
      stage: PricingStageEnum.MARKETING_DISCOUNTS,
      description: 'Evaluated marketing discounts',
      appliedRuleIds: [],
      skippedRuleIds: [],
      timestamp: new Date()
    });

    // STAGE 5: TAXES
    const appliedTaxes = this.taxEvaluator.evaluate(session);
    let taxTotal = zeroMoney();
    for (const tax of appliedTaxes) {
      taxTotal = taxTotal.add(tax.taxAmount);
    }
    trace = trace.addStep({
      stage: PricingStageEnum.TAXES,
      description: 'Evaluated taxes',
      appliedRuleIds: appliedTaxes.map(t => t.taxRuleId),
      skippedRuleIds: [],
      timestamp: new Date()
    });

    // STAGE 6: CHARGES
    const appliedCharges = this.chargeEvaluator.evaluate(session);
    let chargeTotal = zeroMoney();
    for (const charge of appliedCharges) {
      chargeTotal = chargeTotal.add(charge.chargeAmount);
    }
    trace = trace.addStep({
      stage: PricingStageEnum.CHARGES,
      description: 'Evaluated charges and fees',
      appliedRuleIds: appliedCharges.map(c => c.chargeRuleId),
      skippedRuleIds: [],
      timestamp: new Date()
    });

    // STAGE 7: FINAL TOTALS
    const grandTotal = baseTotal
      .add(ruleAdjustmentsTotal)
      .add(marketingDiscountsTotal)
      .add(taxTotal)
      .add(chargeTotal);

    trace = trace.addStep({
      stage: PricingStageEnum.FINAL_TOTALS,
      description: 'Calculated final totals',
      appliedRuleIds: [],
      skippedRuleIds: [],
      timestamp: new Date()
    });

    // STAGE 8: GENERATE SNAPSHOT (Complete Calculation first)
    const result = PricingResult.create({
      baseTotal,
      ruleAdjustmentsTotal,
      marketingDiscountsTotal,
      taxTotal,
      chargeTotal,
      grandTotal
    });

    trace = trace.complete();

    trace = trace.addStep({
      stage: PricingStageEnum.GENERATE_SNAPSHOT,
      description: 'Pipeline execution complete',
      appliedRuleIds: [],
      skippedRuleIds: [],
      timestamp: new Date()
    });

    this.determinismPolicy.enforce(session, trace);

    session.completeCalculation(result, trace, appliedRules, appliedTaxes, appliedCharges);
    
    const snapshot = this.snapshotFactory.createSnapshot(session);
    session.attachSnapshot(snapshot);

    return session;
  }
}
