import { ValueObject } from '@saas/core';

export interface DiscountPolicyIdProps {
  value: string;
}

export class DiscountPolicyId extends ValueObject<DiscountPolicyIdProps> {
  private constructor(props: DiscountPolicyIdProps) {
    super(props);
  }

  public static create(value: string): DiscountPolicyId {
    if (!value || value.trim().length === 0) {
      throw new Error('DiscountPolicyId cannot be empty');
    }
    return new DiscountPolicyId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
