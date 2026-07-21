import { ValueObject } from '@saas/core';

export interface NotificationSubjectProps {
  value: string;
}

export class NotificationSubject extends ValueObject<NotificationSubjectProps> {
  private constructor(props: NotificationSubjectProps) {
    super(props);
  }

  public static create(value: string): NotificationSubject {
    if (!value || value.trim().length === 0) {
      throw new Error('Notification subject cannot be empty');
    }
    return new NotificationSubject({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
