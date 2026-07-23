import { ValueObject } from '@saas/core';

export enum PriorityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface RequisitionPriorityProps {
  level: PriorityLevel;
}

export class RequisitionPriority extends ValueObject<RequisitionPriorityProps> {
  get level(): PriorityLevel {
    return this.props.level;
  }

  private constructor(props: RequisitionPriorityProps) {
    super(props);
  }

  public static create(level: PriorityLevel): RequisitionPriority {
    return new RequisitionPriority({ level });
  }

  public static default(): RequisitionPriority {
    return new RequisitionPriority({ level: PriorityLevel.MEDIUM });
  }
}
