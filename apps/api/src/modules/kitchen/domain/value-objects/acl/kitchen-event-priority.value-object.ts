import { ValueObject } from '@saas/core';

export enum KitchenEventPriorityLevel {
  LOW = 1,
  NORMAL = 2,
  HIGH = 3,
  CRITICAL = 4
}

export interface KitchenEventPriorityProps {
  level: KitchenEventPriorityLevel;
}

export class KitchenEventPriority extends ValueObject<KitchenEventPriorityProps> {
  get level(): KitchenEventPriorityLevel {
    return this.props.level;
  }

  private constructor(props: KitchenEventPriorityProps) {
    super(props);
  }

  public static create(level: KitchenEventPriorityLevel): KitchenEventPriority {
    return new KitchenEventPriority({ level });
  }

  public static default(): KitchenEventPriority {
    return new KitchenEventPriority({ level: KitchenEventPriorityLevel.NORMAL });
  }
}
