import { ValueObject } from '@saas/core';

export interface ChargePolicyIdProps {
  value: string;
}

export class ChargePolicyId extends ValueObject<ChargePolicyIdProps> {
  private constructor(props: ChargePolicyIdProps) {
    super(props);
  }

  public static create(value: string): ChargePolicyId {
    if (!value || value.trim().length === 0) {
      throw new Error('ChargePolicyId cannot be empty');
    }
    return new ChargePolicyId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
