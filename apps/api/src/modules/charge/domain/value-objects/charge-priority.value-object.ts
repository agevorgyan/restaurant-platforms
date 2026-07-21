import { ValueObject } from '@saas/core';

export interface ChargePriorityProps {
  value: number;
}

export class ChargePriority extends ValueObject<ChargePriorityProps> {
  private constructor(props: ChargePriorityProps) {
    super(props);
  }

  public static create(value: number): ChargePriority {
    if (!Number.isInteger(value)) {
      throw new Error('Priority must be an integer');
    }
    if (value < 0) {
      throw new Error('Priority cannot be negative');
    }
    return new ChargePriority({ value });
  }

  get value(): number {
    return this.props.value;
  }

  public isHigherThan(other: ChargePriority): boolean {
    return this.props.value > other.props.value;
  }
}
