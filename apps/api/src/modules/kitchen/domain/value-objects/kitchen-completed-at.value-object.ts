import { ValueObject } from '@saas/core';

export interface KitchenCompletedAtProps {
  value: Date;
}

export class KitchenCompletedAt extends ValueObject<KitchenCompletedAtProps> {
  get value(): Date {
    return this.props.value;
  }

  private constructor(props: KitchenCompletedAtProps) {
    super(props);
  }

  public static create(value: Date): KitchenCompletedAt {
    if (!value) {
      throw new Error('Completion date cannot be null or undefined');
    }
    if (isNaN(value.getTime())) {
      throw new Error('Completion date must be a valid date');
    }
    return new KitchenCompletedAt({ value });
  }
}
