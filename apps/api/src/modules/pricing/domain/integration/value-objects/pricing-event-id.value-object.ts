import { ValueObject } from '@saas/core';

export interface PricingEventIdProps {
  value: string;
}

export class PricingEventId extends ValueObject<PricingEventIdProps> {
  private constructor(props: PricingEventIdProps) {
    super(props);
  }

  public static create(value: string): PricingEventId {
    if (!value || value.trim().length === 0) {
      throw new Error('PricingEventId cannot be empty');
    }
    return new PricingEventId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
