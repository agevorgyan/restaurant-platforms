import { ValueObject } from '@saas/core';

export interface TransitionTimestampProps {
  value: Date;
}

export class TransitionTimestamp extends ValueObject<TransitionTimestampProps> {
  private constructor(props: TransitionTimestampProps) {
    super(props);
  }

  public static create(value: Date = new Date()): TransitionTimestamp {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error('TransitionTimestamp must be a valid Date object');
    }
    return new TransitionTimestamp({ value });
  }

  get value(): Date {
    return this.props.value;
  }
}
