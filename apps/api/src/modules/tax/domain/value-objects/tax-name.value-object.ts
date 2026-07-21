import { ValueObject } from '@saas/core';

export interface TaxNameProps {
  value: string;
}

export class TaxName extends ValueObject<TaxNameProps> {
  private constructor(props: TaxNameProps) {
    super(props);
  }

  public static create(value: string): TaxName {
    const trimmed = value.trim();
    if (trimmed.length < 3 || trimmed.length > 100) {
      throw new Error('TaxName must be between 3 and 100 characters');
    }
    return new TaxName({ value: trimmed });
  }

  get value(): string {
    return this.props.value;
  }
}
