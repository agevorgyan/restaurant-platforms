import { ValueObject } from '@saas/core';

export interface PaymentIdProps {
  value: string;
}

export class PaymentId extends ValueObject<PaymentIdProps> {
  private constructor(props: PaymentIdProps) {
    super(props);
  }

  public static create(value?: string): PaymentId {
    const id = value || crypto.randomUUID();
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('PaymentId must be a valid UUID');
    }

    return new PaymentId({ value: id });
  }

  get value(): string {
    return this.props.value;
  }
}
