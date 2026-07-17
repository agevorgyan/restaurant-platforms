export class PromotionUsageLimit {
  constructor(
    public readonly maxUses?: number,
    public readonly currentUses: number = 0,
    public readonly maxUsesPerCustomer?: number
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.maxUses !== undefined && this.maxUses < 0) {
      throw new Error('Usage limits must never be negative');
    }
    if (this.currentUses < 0) {
      throw new Error('Current uses cannot be negative');
    }
    if (this.maxUsesPerCustomer !== undefined && this.maxUsesPerCustomer < 0) {
      throw new Error('Customer usage limits must never be negative');
    }
  }

  public canBeUsed(): boolean {
    if (this.maxUses === undefined) return true;
    return this.currentUses < this.maxUses;
  }

  public increment(): PromotionUsageLimit {
    if (!this.canBeUsed()) {
      throw new Error('Promotion usage limit reached');
    }
    return new PromotionUsageLimit(this.maxUses, this.currentUses + 1, this.maxUsesPerCustomer);
  }
}
