import { Entity } from '@saas/core';

export interface NotificationRecipientProps {
  userId?: string;
  email?: string;
  phoneNumber?: string;
  deviceToken?: string;
  metadata?: Record<string, any>;
}

export class NotificationRecipient extends Entity<NotificationRecipientProps> {
  private constructor(id: string, props: NotificationRecipientProps) {
    super(id, props);
  }

  public static create(id: string, props: NotificationRecipientProps): NotificationRecipient {
    if (!props.userId && !props.email && !props.phoneNumber && !props.deviceToken) {
      throw new Error('Recipient must have at least one valid delivery target (userId, email, phone, or device token)');
    }
    return new NotificationRecipient(id, props);
  }
}
