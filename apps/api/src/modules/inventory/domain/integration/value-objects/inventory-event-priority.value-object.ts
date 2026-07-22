import { ValueObject } from '@saas/core';

export enum InventoryEventPriorityLevel {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface InventoryEventPriorityProps {
  level: InventoryEventPriorityLevel;
}

export class InventoryEventPriority extends ValueObject<InventoryEventPriorityProps> {
  get level(): InventoryEventPriorityLevel {
    return this.props.level;
  }

  private constructor(props: InventoryEventPriorityProps) {
    super(props);
  }

  public static create(level: InventoryEventPriorityLevel = InventoryEventPriorityLevel.NORMAL): InventoryEventPriority {
    if (!Object.values(InventoryEventPriorityLevel).includes(level)) {
      throw new Error(`Invalid priority level: ${level}`);
    }
    return new InventoryEventPriority({ level });
  }

  public isHigherThan(other: InventoryEventPriority): boolean {
    const order = {
      [InventoryEventPriorityLevel.LOW]: 1,
      [InventoryEventPriorityLevel.NORMAL]: 2,
      [InventoryEventPriorityLevel.HIGH]: 3,
      [InventoryEventPriorityLevel.CRITICAL]: 4
    };

    return order[this.level] > order[other.level];
  }
}
