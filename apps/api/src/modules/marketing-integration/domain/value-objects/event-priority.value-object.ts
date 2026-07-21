import { ValueObject } from '@saas/core';

export enum EventPriorityEnum {
  LOW = 1,
  NORMAL = 5,
  HIGH = 10,
  CRITICAL = 100,
}

export interface EventPriorityProps {
  value: EventPriorityEnum;
}

export class EventPriority extends ValueObject<EventPriorityProps> {
  private constructor(props: EventPriorityProps) {
    super(props);
  }

  public static create(value: EventPriorityEnum): EventPriority {
    return new EventPriority({ value });
  }

  get value(): EventPriorityEnum {
    return this.props.value;
  }
}
