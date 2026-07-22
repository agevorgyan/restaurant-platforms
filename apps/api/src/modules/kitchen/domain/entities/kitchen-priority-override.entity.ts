import { Entity } from '@saas/core';
import { ProductionPriority } from '../enums/production-priority.enum';

export interface KitchenPriorityOverrideProps {
  id: string;
  previousPriority: ProductionPriority;
  newPriority: ProductionPriority;
  reason: string;
  authorId: string;
  occurredAt: Date;
}

export class KitchenPriorityOverride extends Entity<KitchenPriorityOverrideProps> {
  get id(): string {
    return this._id;
  }

  get previousPriority(): ProductionPriority {
    return this.props.previousPriority;
  }

  get newPriority(): ProductionPriority {
    return this.props.newPriority;
  }

  get reason(): string {
    return this.props.reason;
  }

  get authorId(): string {
    return this.props.authorId;
  }

  get occurredAt(): Date {
    return this.props.occurredAt;
  }

  private constructor(id: string, props: KitchenPriorityOverrideProps) {
    super(id, props);
  }

  public static create(
    id: string,
    previousPriority: ProductionPriority,
    newPriority: ProductionPriority,
    reason: string,
    authorId: string
  ): KitchenPriorityOverride {
    if (!reason || reason.trim() === '') {
      throw new Error('Override reason cannot be empty');
    }
    if (!authorId || authorId.trim() === '') {
      throw new Error('Author ID cannot be empty');
    }
    if (previousPriority === newPriority) {
      throw new Error('New priority must be different from previous priority');
    }

    return new KitchenPriorityOverride(id, {
      id,
      previousPriority,
      newPriority,
      reason: reason.trim(),
      authorId: authorId.trim(),
      occurredAt: new Date()
    });
  }
}
