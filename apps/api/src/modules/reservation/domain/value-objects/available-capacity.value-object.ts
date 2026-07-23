import { ValueObject } from '@saas/core';

export interface AvailableCapacityProps { available: number; }
export class AvailableCapacity extends ValueObject<AvailableCapacityProps> {
  get available(): number { return this.props.available; }
  private constructor(props: AvailableCapacityProps) { super(props); }
  public static create(available: number): AvailableCapacity { return new AvailableCapacity({ available }); }
}