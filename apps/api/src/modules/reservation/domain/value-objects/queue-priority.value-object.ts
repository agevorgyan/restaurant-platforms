import { ValueObject } from '@saas/core';

export interface QueuePriorityProps { priorityLevel: number; }
export class QueuePriority extends ValueObject<QueuePriorityProps> {
  get priorityLevel(): number { return this.props.priorityLevel; }
  private constructor(props: QueuePriorityProps) { super(props); }
  public static create(priorityLevel: number): QueuePriority { return new QueuePriority({ priorityLevel }); }
}