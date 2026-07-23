import { ValueObject } from '@saas/core';

export interface PromotionDeadlineProps { deadline: Date; }
export class PromotionDeadline extends ValueObject<PromotionDeadlineProps> {
  get deadline(): Date { return this.props.deadline; }
  private constructor(props: PromotionDeadlineProps) { super(props); }
  public static create(deadline: Date): PromotionDeadline { return new PromotionDeadline({ deadline }); }
}