import { ValueObject } from '@saas/core';

export interface PricingCorrelationIdProps {
  value: string;
}

export class PricingCorrelationId extends ValueObject<PricingCorrelationIdProps> {
  private constructor(props: PricingCorrelationIdProps) {
    super(props);
  }

  public static create(value: string): PricingCorrelationId {
    if (!value || value.trim().length === 0) {
      throw new Error('Correlation ID cannot be empty');
    }
    return new PricingCorrelationId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
