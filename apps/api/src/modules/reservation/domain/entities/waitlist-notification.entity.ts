import { Entity } from '@saas/core';
import { NotificationStatus } from '../value-objects/notification-status.value-object';

export interface WaitlistNotificationProps {
  status: NotificationStatus;
  sentAt?: Date;
  channel: string;
}

export class WaitlistNotification extends Entity<WaitlistNotificationProps> {
  get status(): NotificationStatus { return this.props.status; }
  get sentAt(): Date | undefined { return this.props.sentAt; }
  get channel(): string { return this.props.channel; }
  private constructor(id: string, props: WaitlistNotificationProps) { super(id, props); }
  public static create(props: WaitlistNotificationProps, id?: string): WaitlistNotification {
    return new WaitlistNotification(id || crypto.randomUUID(), props);
  }
}