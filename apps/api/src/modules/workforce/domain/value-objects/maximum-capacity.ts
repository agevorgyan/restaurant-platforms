import { DomainPrimitive } from '@saas/domain';

export class MaximumCapacity extends DomainPrimitive<number> {
  private constructor(value: number) {
    super(value);
  }

  public static create(value: number): MaximumCapacity {
    if (value <= 0) {
      throw new Error('Maximum capacity must be greater than zero.');
    }
    return new MaximumCapacity(value);
  }
}
