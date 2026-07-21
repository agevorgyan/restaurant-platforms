import { ValueObject } from '@saas/core';

export interface TaxCodeProps {
  value: string;
}

export class TaxCode extends ValueObject<TaxCodeProps> {
  private constructor(props: TaxCodeProps) {
    super(props);
  }

  public static create(value: string): TaxCode {
    const sanitized = value.trim().toUpperCase();
    if (!/^[A-Z0-9_-]{3,50}$/.test(sanitized)) {
      throw new Error('TaxCode must be 3-50 characters long and contain only uppercase letters, numbers, hyphens, or underscores');
    }
    return new TaxCode({ value: sanitized });
  }

  get value(): string {
    return this.props.value;
  }
}
