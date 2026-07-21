import { ValueObject } from '@saas/core';

export interface PaymentCausationIdProps {
  value: string;
}

export class PaymentCausationId extends ValueObject<PaymentCausationIdProps> {
  private constructor(props: PaymentCausationIdProps) {
    super(props);
  }

  public static create(value: string): PaymentCausationId {
    if (!value || value.trim().length === 0) {
      throw new Error('PaymentCausationId cannot be empty');
    }
    return new PaymentCausationId({ value: value.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
