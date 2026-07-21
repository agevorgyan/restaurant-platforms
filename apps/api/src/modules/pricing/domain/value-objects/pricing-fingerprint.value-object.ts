import { ValueObject } from '@saas/core';

export interface PricingFingerprintProps {
  value: string;
}

export class PricingFingerprint extends ValueObject<PricingFingerprintProps> {
  private constructor(props: PricingFingerprintProps) {
    super(props);
  }

  public static create(hash: string): PricingFingerprint {
    if (!hash || hash.trim().length === 0) {
      throw new Error('PricingFingerprint cannot be empty');
    }
    return new PricingFingerprint({ value: hash });
  }

  get value(): string {
    return this.props.value;
  }
}
