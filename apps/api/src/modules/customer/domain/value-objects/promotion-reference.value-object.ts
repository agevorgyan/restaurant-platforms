import { ValueObject } from '@saas/core';

export interface PromotionReferenceProps { promotionId: string; }

export class PromotionReference extends ValueObject<PromotionReferenceProps> {
  get promotionId(): string { return this.props.promotionId; }
  private constructor(props: PromotionReferenceProps) { super(props); }
  public static create(promotionId: string): PromotionReference {
    return new PromotionReference({ promotionId });
  }
}