import { Entity } from '@saas/core';
import { PromotionDeadline } from '../value-objects/promotion-deadline.value-object';
import { AcceptanceStatus } from '../value-objects/acceptance-status.value-object';

export interface PromotionAttemptProps {
  startedAt: Date;
  deadline: PromotionDeadline;
  status: AcceptanceStatus;
}

export class PromotionAttempt extends Entity<PromotionAttemptProps> {
  get startedAt(): Date { return this.props.startedAt; }
  get deadline(): PromotionDeadline { return this.props.deadline; }
  get status(): AcceptanceStatus { return this.props.status; }
  
  public markAccepted(): void {
    this.props.status = AcceptanceStatus.create('ACCEPTED');
  }
  public markRejected(): void {
    this.props.status = AcceptanceStatus.create('REJECTED');
  }
  public markExpired(): void {
    this.props.status = AcceptanceStatus.create('EXPIRED');
  }

  private constructor(id: string, props: PromotionAttemptProps) { super(id, props); }
  public static create(props: PromotionAttemptProps, id?: string): PromotionAttempt {
    return new PromotionAttempt(id || crypto.randomUUID(), props);
  }
}