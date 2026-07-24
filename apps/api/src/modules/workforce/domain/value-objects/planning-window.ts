import { DomainPrimitive } from '@saas/domain';

export class PlanningWindow extends DomainPrimitive<number> {
  private constructor(value: number) {
    super(value);
  }

  public static create(value: number): PlanningWindow {
    if (value < 1) {
      throw new Error('Planning window must be at least 1 day.');
    }
    return new PlanningWindow(value);
  }
}
