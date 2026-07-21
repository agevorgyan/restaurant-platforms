import { ValueObject } from '@saas/core';

export interface PaymentReferenceProps {
  value: string;
}

export class PaymentReference extends ValueObject<PaymentReferenceProps> {
  private constructor(props: PaymentReferenceProps) {
    super(props);
  }

  public static create(value: string): PaymentReference {
    if (!value || value.trim().length === 0) {
      throw new Error('PaymentReference cannot be empty');
    }

    return new PaymentReference({ value: value.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
