import { ValueObject } from '@saas/core';

export interface PaymentEventVersionProps {
  major: number;
  minor: number;
}

export class PaymentEventVersion extends ValueObject<PaymentEventVersionProps> {
  private constructor(props: PaymentEventVersionProps) {
    super(props);
  }

  public static create(major: number, minor: number = 0): PaymentEventVersion {
    if (major < 1 || !Number.isInteger(major)) {
      throw new Error('PaymentEventVersion major must be a positive integer');
    }
    if (minor < 0 || !Number.isInteger(minor)) {
      throw new Error('PaymentEventVersion minor must be a non-negative integer');
    }

    return new PaymentEventVersion({ major, minor });
  }

  public isCompatibleWith(other: PaymentEventVersion): boolean {
    return this.props.major === other.props.major;
  }

  public toString(): string {
    return `v${this.props.major}.${this.props.minor}`;
  }

  get major(): number {
    return this.props.major;
  }

  get minor(): number {
    return this.props.minor;
  }
}
