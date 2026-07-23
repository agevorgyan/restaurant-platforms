import { ValueObject } from '@saas/core';

export interface MinimumSelectionProps { value: number; }

export class MinimumSelection extends ValueObject<MinimumSelectionProps> {
  get value(): number { return this.props.value; }
  private constructor(props: MinimumSelectionProps) { super(props); }
  public static create(value: number): MinimumSelection {
    if (value < 0) throw new Error('MinimumSelection must be >= 0');
    return new MinimumSelection({ value });
  }
}