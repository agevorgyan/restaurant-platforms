import { ValueObject } from '@saas/core';

export interface CheckoutSessionIdProps {
  value: string;
}

export class CheckoutSessionId extends ValueObject<CheckoutSessionIdProps> {
  private constructor(props: CheckoutSessionIdProps) {
    super(props);
  }

  public static create(value: string): CheckoutSessionId {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new Error('CheckoutSessionId must be a valid UUID');
    }

    return new CheckoutSessionId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
