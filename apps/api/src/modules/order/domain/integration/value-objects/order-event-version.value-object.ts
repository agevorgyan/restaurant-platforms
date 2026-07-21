import { ValueObject } from '@saas/core';

export interface OrderEventVersionProps {
  major: number;
  minor: number;
}

export class OrderEventVersion extends ValueObject<OrderEventVersionProps> {
  private constructor(props: OrderEventVersionProps) {
    super(props);
  }

  public static create(major: number, minor: number = 0): OrderEventVersion {
    if (major < 1 || !Number.isInteger(major)) {
      throw new Error('OrderEventVersion major must be a positive integer');
    }
    if (minor < 0 || !Number.isInteger(minor)) {
      throw new Error('OrderEventVersion minor must be a non-negative integer');
    }

    return new OrderEventVersion({ major, minor });
  }

  public isCompatibleWith(other: OrderEventVersion): boolean {
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
