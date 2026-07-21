import { ValueObject } from '@saas/core';

export enum ChannelTypeEnum {
  EMAIL = 'Email',
  SMS = 'SMS',
  PUSH = 'Push',
  IN_APP = 'InApp',
  WHATSAPP = 'WhatsApp',
  TELEGRAM = 'Telegram',
  WEBHOOK = 'Webhook',
}

export interface NotificationChannelTypeProps {
  value: ChannelTypeEnum;
}

export class NotificationChannelType extends ValueObject<NotificationChannelTypeProps> {
  private constructor(props: NotificationChannelTypeProps) {
    super(props);
  }

  public static create(value: ChannelTypeEnum): NotificationChannelType {
    return new NotificationChannelType({ value });
  }

  get value(): ChannelTypeEnum {
    return this.props.value;
  }
}
