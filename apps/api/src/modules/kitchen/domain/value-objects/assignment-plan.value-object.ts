import { ValueObject } from '@saas/core';

export interface AssignmentMapping {
  itemId: string; // TicketItem or ProductionId
  stationId: string;
}

export interface AssignmentPlanProps {
  mappings: AssignmentMapping[];
  planDate: Date;
}

export class AssignmentPlan extends ValueObject<AssignmentPlanProps> {
  get mappings(): AssignmentMapping[] {
    return [...this.props.mappings];
  }

  get planDate(): Date {
    return this.props.planDate;
  }

  private constructor(props: AssignmentPlanProps) {
    super(props);
  }

  public static create(mappings: AssignmentMapping[]): AssignmentPlan {
    if (!mappings || mappings.length === 0) {
      throw new Error('Assignment plan must have mappings');
    }
    return new AssignmentPlan({
      mappings: [...mappings],
      planDate: new Date()
    });
  }
}
