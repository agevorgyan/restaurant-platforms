import { ValueObject } from '@saas/core';

export interface PricingCausationIdProps {
  value: string;
}

export class PricingCausationId extends ValueObject<PricingCausationIdProps> {
  private constructor(props: PricingCausationIdProps) {
    super(props);
  }

  public static create(value: string): PricingCausationId {
    if (!value || value.trim().length === 0) {
      throw new Error('Causation ID cannot be empty');
    }
    return new PricingCausationId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
