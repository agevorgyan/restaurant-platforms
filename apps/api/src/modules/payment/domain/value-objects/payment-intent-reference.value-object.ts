import { ValueObject } from '@saas/core';

export interface PaymentIntentReferenceProps {
  value: string;
}

export class PaymentIntentReference extends ValueObject<PaymentIntentReferenceProps> {
  private constructor(props: PaymentIntentReferenceProps) {
    super(props);
  }

  public static create(value: string): PaymentIntentReference {
    if (!value || value.trim().length === 0) {
      throw new Error('PaymentIntentReference cannot be empty');
    }
    return new PaymentIntentReference({ value: value.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
