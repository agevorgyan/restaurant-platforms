import { ValueObject } from '@saas/core';

export enum NotificationTemplateStatusEnum {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  ARCHIVED = 'Archived',
}

export interface NotificationStatusProps {
  value: NotificationTemplateStatusEnum;
}

export class NotificationStatus extends ValueObject<NotificationStatusProps> {
  private constructor(props: NotificationStatusProps) {
    super(props);
  }

  public static initial(): NotificationStatus {
    return new NotificationStatus({ value: NotificationTemplateStatusEnum.DRAFT });
  }

  public static create(value: NotificationTemplateStatusEnum): NotificationStatus {
    return new NotificationStatus({ value });
  }

  get value(): NotificationTemplateStatusEnum {
    return this.props.value;
  }

  public isDraft(): boolean {
    return this.props.value === NotificationTemplateStatusEnum.DRAFT;
  }

  public isPublished(): boolean {
    return this.props.value === NotificationTemplateStatusEnum.PUBLISHED;
  }

  public isArchived(): boolean {
    return this.props.value === NotificationTemplateStatusEnum.ARCHIVED;
  }
}
