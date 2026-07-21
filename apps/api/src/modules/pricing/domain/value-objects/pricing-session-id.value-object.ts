import { ValueObject } from '@saas/core';

export interface PricingSessionIdProps {
  value: string;
}

export class PricingSessionId extends ValueObject<PricingSessionIdProps> {
  private constructor(props: PricingSessionIdProps) {
    super(props);
  }

  public static create(value: string): PricingSessionId {
    if (!value || value.trim().length === 0) {
      throw new Error('PricingSessionId cannot be empty');
    }
    return new PricingSessionId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
