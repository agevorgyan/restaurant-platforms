import { ValueObject } from '@saas/core';

export enum NotificationPriorityEnum {
  LOW = 'Low',
  NORMAL = 'Normal',
  HIGH = 'High',
  URGENT = 'Urgent',
}

export interface NotificationPriorityProps {
  value: NotificationPriorityEnum;
}

export class NotificationPriority extends ValueObject<NotificationPriorityProps> {
  private constructor(props: NotificationPriorityProps) {
    super(props);
  }

  public static create(value: NotificationPriorityEnum): NotificationPriority {
    return new NotificationPriority({ value });
  }

  get value(): NotificationPriorityEnum {
    return this.props.value;
  }
}
