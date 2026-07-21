import { ValueObject } from '@saas/core';

export interface DiscountPriorityProps {
  value: number;
}

export class DiscountPriority extends ValueObject<DiscountPriorityProps> {
  private constructor(props: DiscountPriorityProps) {
    super(props);
  }

  public static create(value: number): DiscountPriority {
    if (value < 0) {
      throw new Error('Priority cannot be negative');
    }
    return new DiscountPriority({ value });
  }

  get value(): number {
    return this.props.value;
  }

  public isHigherPriorityThan(other: DiscountPriority): boolean {
    // Lower number means higher priority (1 is highest, 99 is lower)
    return this.props.value < other.props.value;
  }
}
