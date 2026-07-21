import { ValueObject } from '@saas/core';

export interface TaxPolicyIdProps {
  value: string;
}

export class TaxPolicyId extends ValueObject<TaxPolicyIdProps> {
  private constructor(props: TaxPolicyIdProps) {
    super(props);
  }

  public static create(value: string): TaxPolicyId {
    if (!value || value.trim().length === 0) {
      throw new Error('TaxPolicyId cannot be empty');
    }
    return new TaxPolicyId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
