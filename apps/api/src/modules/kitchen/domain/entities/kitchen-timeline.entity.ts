import { Entity } from '@saas/core';
import { KitchenTicketStatus as KitchenTicketStatusEnum } from '../enums/kitchen-ticket-status.enum';

export interface KitchenTimelineProps {
  id: string;
  status: KitchenTicketStatusEnum;
  occurredAt: Date;
  triggeredBy: string;
  reason?: string;
}

export class KitchenTimeline extends Entity<KitchenTimelineProps> {
  get id(): string {
    return this._id;
  }

  get status(): KitchenTicketStatusEnum {
    return this.props.status;
  }

  get occurredAt(): Date {
    return this.props.occurredAt;
  }

  get triggeredBy(): string {
    return this.props.triggeredBy;
  }

  get reason(): string | undefined {
    return this.props.reason;
  }

  private constructor(id: string, props: KitchenTimelineProps) {
    super(id, props);
  }

  public static create(
    id: string,
    status: KitchenTicketStatusEnum,
    triggeredBy: string,
    reason?: string
  ): KitchenTimeline {
    if (!triggeredBy || triggeredBy.trim() === '') {
      throw new Error('Triggered by cannot be empty');
    }

    return new KitchenTimeline(id, {
      id,
      status,
      occurredAt: new Date(),
      triggeredBy: triggeredBy.trim(),
      reason
    });
  }
}
