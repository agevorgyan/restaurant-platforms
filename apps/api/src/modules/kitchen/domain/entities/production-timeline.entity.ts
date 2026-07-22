import { Entity } from '@saas/core';
import { ProductionStatus } from '../enums/production-status.enum';

export interface ProductionTimelineProps {
  id: string;
  status: ProductionStatus;
  occurredAt: Date;
  triggeredBy: string;
  reason?: string;
}

export class ProductionTimeline extends Entity<ProductionTimelineProps> {
  get id(): string {
    return this._id;
  }

  get status(): ProductionStatus {
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

  private constructor(id: string, props: ProductionTimelineProps) {
    super(id, props);
  }

  public static create(
    id: string,
    status: ProductionStatus,
    triggeredBy: string,
    reason?: string
  ): ProductionTimeline {
    if (!triggeredBy || triggeredBy.trim() === '') {
      throw new Error('Triggered by cannot be empty');
    }

    return new ProductionTimeline(id, {
      id,
      status,
      occurredAt: new Date(),
      triggeredBy: triggeredBy.trim(),
      reason
    });
  }
}
