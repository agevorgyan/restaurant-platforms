import { ValueObject } from '@saas/core';

export interface MaximumSelectionProps { value: number; }

export class MaximumSelection extends ValueObject<MaximumSelectionProps> {
  get value(): number { return this.props.value; }
  private constructor(props: MaximumSelectionProps) { super(props); }
  public static create(value: number): MaximumSelection {
    if (value < 0) throw new Error('MaximumSelection must be >= 0');
    return new MaximumSelection({ value });
  }
}