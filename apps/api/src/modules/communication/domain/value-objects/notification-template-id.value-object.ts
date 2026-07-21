import { ValueObject } from '@saas/core';

export interface NotificationTemplateIdProps {
  value: string;
}

export class NotificationTemplateId extends ValueObject<NotificationTemplateIdProps> {
  private constructor(props: NotificationTemplateIdProps) {
    super(props);
  }

  public static create(value: string): NotificationTemplateId {
    if (!value || value.trim().length === 0) {
      throw new Error('NotificationTemplateId cannot be empty');
    }
    return new NotificationTemplateId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
