import { ValueObject } from '@saas/core';

export interface PromotionWindowProps { timeoutMinutes: number; }
export class PromotionWindow extends ValueObject<PromotionWindowProps> {
  get timeoutMinutes(): number { return this.props.timeoutMinutes; }
  private constructor(props: PromotionWindowProps) { super(props); }
  public static create(timeoutMinutes: number): PromotionWindow { return new PromotionWindow({ timeoutMinutes }); }
}