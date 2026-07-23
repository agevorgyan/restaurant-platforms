import { Entity } from '@saas/core';
import { WaitlistStatusEnum } from '../value-objects/waitlist-status.value-object';

export interface WaitlistTimelineProps {
  status: WaitlistStatusEnum;
  recordedAt: Date;
  reason?: string;
}

export class WaitlistTimeline extends Entity<WaitlistTimelineProps> {
  get status(): WaitlistStatusEnum { return this.props.status; }
  get recordedAt(): Date { return this.props.recordedAt; }
  get reason(): string | undefined { return this.props.reason; }
  private constructor(id: string, props: WaitlistTimelineProps) { super(id, props); }
  public static create(props: WaitlistTimelineProps, id?: string): WaitlistTimeline {
    return new WaitlistTimeline(id || crypto.randomUUID(), props);
  }
}