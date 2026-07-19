import { ValueObject } from '@saas/core';

interface PromotionPriorityProps {
  value: number;
}

export class PromotionPriority extends ValueObject<PromotionPriorityProps> {
  private constructor(props: PromotionPriorityProps) {
    super(props);
  }

  public get value(): number {
    return this.props.value;
  }

  public static create(priority: number): PromotionPriority {
    if (priority < 0) {
      throw new Error('PromotionPriority cannot be negative');
    }
    return new PromotionPriority({ value: priority });
  }
}
