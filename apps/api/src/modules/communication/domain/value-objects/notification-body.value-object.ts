import { ValueObject } from '@saas/core';

export interface NotificationBodyProps {
  value: string;
}

export class NotificationBody extends ValueObject<NotificationBodyProps> {
  private constructor(props: NotificationBodyProps) {
    super(props);
  }

  public static create(value: string): NotificationBody {
    if (!value || value.trim().length === 0) {
      throw new Error('Notification body cannot be empty');
    }
    return new NotificationBody({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
