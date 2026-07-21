import { Entity } from '@saas/core';
import { WorkflowSchedule } from '../value-objects/workflow-schedule.value-object';

export enum TriggerType {
  CUSTOMER_REGISTERED = 'CustomerRegistered',
  FIRST_ORDER = 'FirstOrder',
  ORDER_COMPLETED = 'OrderCompleted',
  ORDER_CANCELLED = 'OrderCancelled',
  CUSTOMER_BIRTHDAY = 'CustomerBirthday',
  LOYALTY_TIER_CHANGED = 'LoyaltyTierChanged',
  COUPON_REDEEMED = 'CouponRedeemed',
  PROMOTION_ACTIVATED = 'PromotionActivated',
  CAMPAIGN_STARTED = 'CampaignStarted',
  CAMPAIGN_FINISHED = 'CampaignFinished',
  RESTAURANT_CREATED = 'RestaurantCreated',
  BRANCH_OPENED = 'BranchOpened',
  MANUAL_TRIGGER = 'ManualTrigger',
  SCHEDULED_TRIGGER = 'ScheduledTrigger',
}

export interface WorkflowTriggerProps {
  type: TriggerType;
  schedule?: WorkflowSchedule; // Used if type is SCHEDULED_TRIGGER
}

export class WorkflowTrigger extends Entity<WorkflowTriggerProps> {
  private constructor(id: string, props: WorkflowTriggerProps) {
    super(id, props);
  }

  public static create(id: string, type: TriggerType, schedule?: WorkflowSchedule): WorkflowTrigger {
    if (type === TriggerType.SCHEDULED_TRIGGER && !schedule) {
      throw new Error('Scheduled triggers must provide a schedule');
    }
    return new WorkflowTrigger(id, { type, schedule });
  }

  get type(): TriggerType {
    return this.props.type;
  }

  get schedule(): WorkflowSchedule | undefined {
    return this.props.schedule;
  }
}
