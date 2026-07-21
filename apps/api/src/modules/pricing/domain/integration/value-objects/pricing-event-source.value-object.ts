import { ValueObject } from '@saas/core';

export enum PricingEventSourceEnum {
  PRICING_SESSION = 'PRICING_SESSION',
  ORDER_QUOTATION = 'ORDER_QUOTATION',
  PRICING_RULE_ENGINE = 'PRICING_RULE_ENGINE',
  TAX_POLICY_ENGINE = 'TAX_POLICY_ENGINE',
  CHARGE_ENGINE = 'CHARGE_ENGINE',
  FINANCE = 'FINANCE'
}

export interface PricingEventSourceProps {
  value: PricingEventSourceEnum;
}

export class PricingEventSource extends ValueObject<PricingEventSourceProps> {
  private constructor(props: PricingEventSourceProps) {
    super(props);
  }

  public static create(value: PricingEventSourceEnum): PricingEventSource {
    if (!Object.values(PricingEventSourceEnum).includes(value)) {
      throw new Error(`Invalid event source: ${value}`);
    }
    return new PricingEventSource({ value });
  }

  get value(): PricingEventSourceEnum {
    return this.props.value;
  }
}
