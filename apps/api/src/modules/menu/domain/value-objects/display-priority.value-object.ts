import { ValueObject } from '@saas/core';

export interface DisplayPriorityProps { priority: number; }

export class DisplayPriority extends ValueObject<DisplayPriorityProps> {
  get priority(): number { return this.props.priority; }
  private constructor(props: DisplayPriorityProps) { super(props); }
  public static create(priority: number): DisplayPriority {
    if (priority < 0) throw new Error('DisplayPriority must be non-negative');
    return new DisplayPriority({ priority });
  }
}