import { ValueObject } from '@saas/core';

export interface PaymentIntentIdProps {
  value: string;
}

export class PaymentIntentId extends ValueObject<PaymentIntentIdProps> {
  private constructor(props: PaymentIntentIdProps) {
    super(props);
  }

  public static create(value?: string): PaymentIntentId {
    const id = value || crypto.randomUUID();
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('PaymentIntentId must be a valid UUID');
    }

    return new PaymentIntentId({ value: id });
  }

  get value(): string {
    return this.props.value;
  }
}
