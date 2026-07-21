import { ValueObject } from '@saas/core';

export interface PaymentCorrelationIdProps {
  value: string;
}

export class PaymentCorrelationId extends ValueObject<PaymentCorrelationIdProps> {
  private constructor(props: PaymentCorrelationIdProps) {
    super(props);
  }

  public static create(value?: string): PaymentCorrelationId {
    return new PaymentCorrelationId({ value: value || crypto.randomUUID() });
  }

  get value(): string {
    return this.props.value;
  }
}
