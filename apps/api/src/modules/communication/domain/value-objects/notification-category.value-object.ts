import { ValueObject } from '@saas/core';

export enum NotificationCategoryEnum {
  MARKETING = 'Marketing',
  TRANSACTIONAL = 'Transactional',
  SYSTEM = 'System',
}

export interface NotificationCategoryProps {
  value: NotificationCategoryEnum;
}

export class NotificationCategory extends ValueObject<NotificationCategoryProps> {
  private constructor(props: NotificationCategoryProps) {
    super(props);
  }

  public static create(value: NotificationCategoryEnum): NotificationCategory {
    return new NotificationCategory({ value });
  }

  get value(): NotificationCategoryEnum {
    return this.props.value;
  }
}
