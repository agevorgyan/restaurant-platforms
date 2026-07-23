import { ValueObject } from '@saas/core';

export interface NotificationStatusProps { status: 'PENDING' | 'SENT' | 'FAILED'; }
export class NotificationStatus extends ValueObject<NotificationStatusProps> {
  get status(): 'PENDING' | 'SENT' | 'FAILED' { return this.props.status; }
  private constructor(props: NotificationStatusProps) { super(props); }
  public static create(status: 'PENDING' | 'SENT' | 'FAILED'): NotificationStatus { return new NotificationStatus({ status }); }
}