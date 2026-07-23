import { ValueObject } from '@saas/core';

export interface PointsReasonProps { reason: string; }

export class PointsReason extends ValueObject<PointsReasonProps> {
  get reason(): string { return this.props.reason; }
  private constructor(props: PointsReasonProps) { super(props); }
  public static create(reason: string): PointsReason {
    return new PointsReason({ reason });
  }
}