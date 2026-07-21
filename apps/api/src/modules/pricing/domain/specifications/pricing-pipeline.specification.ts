import { PricingStageEnum } from '../value-objects/pricing-stage.value-object';
import { CalculationTrace } from '../value-objects/calculation-trace.value-object';

export class PricingPipelineSpecification {
  public isSatisfiedBy(trace: CalculationTrace): boolean {
    // Pipeline must be executed in the correct deterministic order
    const expectedOrder = [
      PricingStageEnum.LOAD_CONTEXT,
      PricingStageEnum.BASE_PRICES,
      PricingStageEnum.PRICING_RULES,
      PricingStageEnum.MARKETING_DISCOUNTS,
      PricingStageEnum.TAXES,
      PricingStageEnum.CHARGES,
      PricingStageEnum.FINAL_TOTALS,
      PricingStageEnum.GENERATE_SNAPSHOT,
    ];

    if (trace.steps.length !== expectedOrder.length) {
      return false;
    }

    for (let i = 0; i < expectedOrder.length; i++) {
      if (trace.steps[i].stage !== expectedOrder[i]) {
        return false;
      }
    }

    return true;
  }
}
