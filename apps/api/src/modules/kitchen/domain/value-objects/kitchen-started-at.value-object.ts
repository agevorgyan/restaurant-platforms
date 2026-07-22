import { ValueObject } from '@saas/core';

export interface KitchenStartedAtProps {
  value: Date;
}

export class KitchenStartedAt extends ValueObject<KitchenStartedAtProps> {
  get value(): Date {
    return this.props.value;
  }

  private constructor(props: KitchenStartedAtProps) {
    super(props);
  }

  public static create(value: Date): KitchenStartedAt {
    if (!value) {
      throw new Error('Start date cannot be null or undefined');
    }
    if (isNaN(value.getTime())) {
      throw new Error('Start date must be a valid date');
    }
    return new KitchenStartedAt({ value });
  }
}
