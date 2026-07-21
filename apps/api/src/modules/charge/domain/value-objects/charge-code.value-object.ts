import { ValueObject } from '@saas/core';

export interface ChargeCodeProps {
  value: string;
}

export class ChargeCode extends ValueObject<ChargeCodeProps> {
  private constructor(props: ChargeCodeProps) {
    super(props);
  }

  public static create(value: string): ChargeCode {
    const sanitized = value.trim().toUpperCase();
    if (!/^[A-Z0-9_-]{3,50}$/.test(sanitized)) {
      throw new Error('ChargeCode must be 3-50 characters long and contain only uppercase letters, numbers, hyphens, or underscores');
    }
    return new ChargeCode({ value: sanitized });
  }

  get value(): string {
    return this.props.value;
  }
}
