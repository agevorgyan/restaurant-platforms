import { ValueObject } from '@saas/core';

export interface AssignmentPriorityProps { priorityLevel: number; }
export class AssignmentPriority extends ValueObject<AssignmentPriorityProps> {
  get priorityLevel(): number { return this.props.priorityLevel; }
  private constructor(props: AssignmentPriorityProps) { super(props); }
  public static create(priorityLevel: number): AssignmentPriority { return new AssignmentPriority({ priorityLevel }); }
}