import { ValueObject } from '@saas/core';

interface PromotionLimitProps {
  maxUses: number;
  currentUses: number;
}

export class PromotionLimit extends ValueObject<PromotionLimitProps> {
  private constructor(props: PromotionLimitProps) {
    super(props);
  }

  public get maxUses(): number {
    return this.props.maxUses;
  }

  public get currentUses(): number {
    return this.props.currentUses;
  }

  public static create(maxUses: number, currentUses: number = 0): PromotionLimit {
    if (maxUses < 0) {
      throw new Error('Usage limits must never be negative');
    }
    if (currentUses < 0) {
      throw new Error('Current uses cannot be negative');
    }
    return new PromotionLimit({ maxUses, currentUses });
  }

  public canBeUsed(): boolean {
    return this.currentUses < this.maxUses;
  }

  public increment(): PromotionLimit {
    if (!this.canBeUsed()) {
      throw new Error('Promotion usage limit reached');
    }
    return new PromotionLimit({ maxUses: this.maxUses, currentUses: this.currentUses + 1 });
  }
}
