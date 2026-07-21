import { ValueObject } from '@saas/core';

export interface ChargeNameProps {
  value: string;
}

export class ChargeName extends ValueObject<ChargeNameProps> {
  private constructor(props: ChargeNameProps) {
    super(props);
  }

  public static create(value: string): ChargeName {
    const trimmed = value.trim();
    if (trimmed.length < 3 || trimmed.length > 100) {
      throw new Error('ChargeName must be between 3 and 100 characters');
    }
    return new ChargeName({ value: trimmed });
  }

  get value(): string {
    return this.props.value;
  }
}
