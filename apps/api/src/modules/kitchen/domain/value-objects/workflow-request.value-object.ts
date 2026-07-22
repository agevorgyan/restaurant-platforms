import { ValueObject } from '@saas/core';

export interface WorkflowRequestProps {
  kitchenTicketId?: string;
  productionId?: string;
  triggeredBy: string;
}

export class WorkflowRequest extends ValueObject<WorkflowRequestProps> {
  get kitchenTicketId(): string | undefined {
    return this.props.kitchenTicketId;
  }

  get productionId(): string | undefined {
    return this.props.productionId;
  }

  get triggeredBy(): string {
    return this.props.triggeredBy;
  }

  private constructor(props: WorkflowRequestProps) {
    super(props);
  }

  public static create(triggeredBy: string, kitchenTicketId?: string, productionId?: string): WorkflowRequest {
    if (!triggeredBy || triggeredBy.trim() === '') {
      throw new Error('Triggered by cannot be empty');
    }
    if (!kitchenTicketId && !productionId) {
      throw new Error('Workflow request must contain at least a ticket or a production ID');
    }
    return new WorkflowRequest({
      triggeredBy: triggeredBy.trim(),
      kitchenTicketId,
      productionId
    });
  }
}
