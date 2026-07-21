import { ValueObject } from '@saas/core';

export enum PricingStageEnum {
  LOAD_CONTEXT = 'LOAD_CONTEXT',
  BASE_PRICES = 'BASE_PRICES',
  PRICING_RULES = 'PRICING_RULES',
  MARKETING_DISCOUNTS = 'MARKETING_DISCOUNTS',
  TAXES = 'TAXES',
  CHARGES = 'CHARGES',
  FINAL_TOTALS = 'FINAL_TOTALS',
  GENERATE_SNAPSHOT = 'GENERATE_SNAPSHOT',
}

export interface PricingStageProps {
  value: PricingStageEnum;
}

export class PricingStage extends ValueObject<PricingStageProps> {
  private constructor(props: PricingStageProps) {
    super(props);
  }

  public static create(value: PricingStageEnum): PricingStage {
    if (!Object.values(PricingStageEnum).includes(value)) {
      throw new Error(`Invalid pricing stage: ${value}`);
    }
    return new PricingStage({ value });
  }

  get value(): PricingStageEnum {
    return this.props.value;
  }
}
