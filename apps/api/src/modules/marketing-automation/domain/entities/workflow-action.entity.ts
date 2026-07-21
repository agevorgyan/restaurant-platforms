import { Entity } from '@saas/core';
import { WorkflowDelay } from '../value-objects/workflow-delay.value-object';

export enum ActionType {
  ACTIVATE_CAMPAIGN = 'ActivateCampaign',
  DEACTIVATE_CAMPAIGN = 'DeactivateCampaign',
  ACTIVATE_PROMOTION = 'ActivatePromotion',
  DEACTIVATE_PROMOTION = 'DeactivatePromotion',
  GENERATE_COUPON = 'GenerateCoupon',
  ASSIGN_COUPON = 'AssignCoupon',
  SCHEDULE_NOTIFICATION = 'ScheduleNotification',
  ADD_LOYALTY_POINTS = 'AddLoyaltyPoints',
  REMOVE_LOYALTY_POINTS = 'RemoveLoyaltyPoints',
  CREATE_FOLLOW_UP_TASK = 'CreateFollowUpTask',
  EMIT_DOMAIN_EVENT = 'EmitDomainEvent',
  WAIT_DELAY = 'WaitDelay',
  CONDITIONAL_BRANCH = 'ConditionalBranch',
}

export interface WorkflowActionProps {
  type: ActionType;
  payload?: any;
  delay?: WorkflowDelay; // Used if type is WAIT_DELAY
}

export class WorkflowAction extends Entity<WorkflowActionProps> {
  private constructor(id: string, props: WorkflowActionProps) {
    super(id, props);
  }

  public static create(id: string, type: ActionType, payload?: any, delay?: WorkflowDelay): WorkflowAction {
    if (type === ActionType.WAIT_DELAY && !delay) {
      throw new Error('Wait/Delay actions must provide a delay configuration');
    }
    return new WorkflowAction(id, { type, payload, delay });
  }

  get type(): ActionType {
    return this.props.type;
  }

  get payload(): any {
    return this.props.payload;
  }

  get delay(): WorkflowDelay | undefined {
    return this.props.delay;
  }
}
